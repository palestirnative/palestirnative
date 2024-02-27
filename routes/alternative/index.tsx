import { Handler } from "$fresh/server.ts";
import { AlternativeCreationData } from "../../types/alternative.ts";
import { AlternativeStatus } from "../../types/boycott.ts";
import { CheckBadgeSolid, CalendarSolid, TagSolid } from "https://esm.sh/preact-heroicons"
import db from "../../utils/db/db.ts";
import upload from "../../utils/upload.ts";
import { ObjectId } from "mongodb";

export const handler: Handler = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();

    const requiredFields = [
      "name",
      "countries",
      "logo",
    ];

    for (const field of requiredFields) {
      if (!form.get(field)) {
        return new Response(`Missing required field: ${field}`, {
          status: 400,
        });
      }
    }

    const parsedCountries = form.get("countries").split(",");
    const allAreCountryCodes = parsedCountries.every((country) => {
      return /^[a-z]{2}$/.test(country);
    })
    if (parsedCountries.length === 0 || !allAreCountryCodes) {
      return new Response("Invalid countries", {
        status: 400,
      });
    }

    const logo = form.get("logo") as File;

    if (!logo instanceof File || !logo.type.startsWith("image/")) {
      return new Response("Invalid logo file", {
        status: 400,
      });
    }

    const alternative: AlternativeCreationData = {
      name: form.get("name"),
      countries: parsedCountries,
      logoURL: form.get("logoURL"),
      nameSlug: form.get("name")!.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date(),
    };

    const existingSlug = await db.collection("alternatives").findOne({
      nameSlug: alternative.nameSlug,
    });

    if (existingSlug) {
      return new Response("Slug already exists", {
        status: 400,
      });
    }

    const uploadResult = await upload(logo);
    const logoURL = `https://ucarecdn.com/${uploadResult?.File}/`;

    if (!logoURL) {
      return new Response("Failed to upload logo", {
        status: 500,
      });
    }

    alternative.logoURL = logoURL;

    const insertResult = await db.collection("alternatives").insertOne(
      alternative,
    );

    if (!insertResult.acknowledged) {
      return new Response("Failed to create alternative", {
        status: 500,
      });
    }

    const insertedAlternative: Alternative = {
      ...alternative,
      _id: insertResult.insertedId,
    };

    const boycottIds = form.get("boycotts").split(",").filter(Boolean).map((boycott: string) =>
      new ObjectId(boycott)
    );

    const updateBoycottsResult = await db.collection("boycotts").updateMany({
      _id: { $in: boycottIds },
    }, {
      $push: {
        alternatives: {
          alternative: insertedAlternative._id,
          status: AlternativeStatus.Pending,
        },
      },
    });

    if (!updateBoycottsResult.acknowledged) {
      return new Response("Failed to update boycotts", {
        status: 500,
      });
    }

    return new Response(JSON.stringify(insertedAlternative), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
  async GET(req, ctx) {
    let page = parseInt(new URL(req.url).searchParams.get("page"));

    if (isNaN(page)) {
      page = 1;
    }

    const totalCount = await db.collection("alternatives").countDocuments();
    const totalPages = Math.ceil(totalCount / 10) || 1;

    if (page > totalPages) {
      throw new Deno.errors.NotFound();
    }

    const list = await db.collection("alternatives").aggregate([
      {
        $lookup: {
          from: "boycotts",
          localField: "_id",
          foreignField: "alternatives.alternative",
          as: "boycotts",
        }, 
      },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
    ]).toArray();

    return ctx.render({ alternatives: list, page, totalCount, totalPages });
  },
};

export default function Alternative({ data }) {
  const { alternatives, page, totalCount, totalPages } = data;

  const pagesToShow = [{ label: page, type: "page" }];

  if (page > 1) {
    pagesToShow.unshift({ label: page - 1, type: "page" });
  }
  if (page > 2) {
    pagesToShow.unshift({ label: page - 2, type: "page" });
  }
  if (page > 3) {
    pagesToShow.unshift(...[
      { label: 1, type: "page" },
      { label: "...", type: "ellipsis" },
    ]);
  }
  if (page < totalPages) {
    pagesToShow.push({ label: page + 1, type: "page" });
  }
  if (page < totalPages - 1) {
    pagesToShow.push({ label: page + 2, type: "page" });
  }
  if (page < totalPages - 2) {
    pagesToShow.push(...[
      { label: "...", type: "ellipsis" },
      { label: totalPages, type: "page" },
    ]);
  }

  return (
    <>
      <section class="container px-4 mx-auto mt-10">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-x-3">
              <h2 class="text-lg font-medium text-gray-800 dark:text-white">
                Alternatives
              </h2>

              <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                {totalCount}
              </span>
            </div>
          </div>

          <div class="flex items-center mt-4 gap-x-3">
            <a
              href="/alternative/form"
              class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Add an Alternative</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col mt-6">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <div class="flex items-center gap-x-3">
                          <span>Name</span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button class="flex items-center gap-x-2">
                          <span>Boycotts</span>

                          <CheckBadgeSolid class="w-4 h-4" />
                        </button>
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button class="flex items-center gap-x-2">
                          <span>Created at</span>

                          <CalendarSolid class="w-4 h-4" />
                        </button>
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button class="flex items-center gap-x-2">
                          <span>Countries</span>

                          <TagSolid class="w-4 h-4" />
                        </button>
                      </th>

                      <th scope="col" class="relative py-3.5 px-4">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {alternatives.map((alternative) => (
                      <tr>
                        <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div class="inline-flex items-center gap-x-3">
                            <div class="flex items-center gap-x-2">
                              <img
                                class="object-cover w-10 h-10 rounded-full"
                                src={alternative.logoURL}
                                alt="Coca Cola"
                              />
                              <div>
                                <h2 class="font-medium text-gray-800 dark:text-white ">
                                  {alternative.name}
                                </h2>
                                <p class="text-sm font-normal text-gray-600 dark:text-gray-400">
                                  {alternative.nameSlug}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                            <h2 class="text-sm font-normal text-emerald-500">
                              {alternative.boycotts?.length || 0}
                            </h2>
                          </div>
                        </td>
                        <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {alternative.createdAt?.toLocaleDateString("fr-FR")}
                        </td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                          <div class="flex items-center gap-x-2">
                            {alternative.countries.map((country) => (
                              <img
                                class="object-cover w-6 h-6 rounded-full"
                                src={`/flags/${country}.svg`}
                                alt={country}
                              />
                            ))}
                          </div>
                        </td>
                        <td class="px-4 py-4 text-sm whitespace-nowrap">
                          <div class="flex items-center gap-x-6">
                            <a
                              href={`/alternative/remove?id=${alternative._id}`}
                              class="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-5 h-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </a>

                            <a
                              href={`/alternative/form?id=${alternative._id}`}
                              class="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-5 h-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center mt-6">
          {page > 1 && (
            <a
              href="#"
              class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>

              <span>
                previous
              </span>
            </a>
          )}

          <div class="items-center hidden lg:flex gap-x-3 flex-fill">
            {pagesToShow.map((pageItem) => (
              pageItem.label === page
                ? (
                  <span class="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60">
                    1
                  </span>
                )
                : (
                  pageItem.type === "page"
                    ? (
                      <a
                        href={`/boycott?page=${pageItem.label}`}
                        class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100"
                      >
                        {pageItem.label}
                      </a>
                    )
                    : (
                      <span class="px-2 py-1 text-sm text-gray-500 rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                        {pageItem.label}
                      </span>
                    )
                )
            ))}
          </div>

          {page !== totalPages && (
            <a
              href={`/boycott?page=${page + 1}`}
              class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <span>
                Next
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </a>
          )}
        </div>
      </section>
    </>
  );
}
