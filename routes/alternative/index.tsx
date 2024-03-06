import { Handler } from "$fresh/server.ts";
import { AlternativeCreationData } from "../../types/alternative.ts";
import { AlternativeStatus } from "../../types/boycott.ts";
import {
  CalendarSolid,
  CheckBadgeSolid,
  TagSolid,
} from "https://esm.sh/preact-heroicons";
import db from "../../utils/db/db.ts";
import upload from "../../utils/upload.ts";
import AlternativesGrid from "../../components/alternativesGrid.tsx";
import { ObjectId } from "mongodb";
import slugify from "../../utils/slugify.ts";

export const handler: Handler = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();

    const requiredFields = [
      "name",
      "countries",
      "logo",
      "website",
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
    });
    if (parsedCountries.length === 0 || !allAreCountryCodes) {
      return new Response("Invalid countries", {
        status: 400,
      });
    }

    const logo = form.get("logo") as File;

    if ((!logo) instanceof File || !logo.type.startsWith("image/")) {
      return new Response("Invalid logo file", {
        status: 400,
      });
    }

    const alternative: AlternativeCreationData = {
      name: form.get("name"),
      countries: parsedCountries,
      website: form.get("website"),
      logoURL: form.get("logoURL"),
      nameSlug: slugify(form.get("name")),
      createdAt: new Date(),
      status: AlternativeStatus.Pending,
    };

    const existingSlug = await db.collection("alternatives").findOne({
      nameSlug: alternative.nameSlug,
    });

    if (existingSlug) {
      return new Response("Name already exists", {
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

    const boycottIds = form.get("boycotts").split(",").filter(Boolean).map((
      boycott: string,
    ) => new ObjectId(boycott));

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
      {
        $lookup: {
          from: "categories",
          localField: "boycotts.categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      ...(ctx.state.category
        ? [{
          $match: {
            "categories.nameSlug": ctx.state.category,
          },
        }]
        : []),
      ...(ctx.state.search
        ? [{
          $match: {
            $or: [
              { name: { $regex: ctx.state.search, $options: "i" } },
              {
                "boycotts.name": {
                  $regex: ctx.state.search,
                  $options: "i",
                },
              },
              {
                "boycotts.categories.name": {
                  $regex: ctx.state.search,
                  $options: "i",
                },
              },
            ],
          },
        }]
        : []),
      ...(ctx.state.country
        ? [{
          $match: {
            "countries": ctx.state.country.toLowerCase(),
          },
        }]
        : []),
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
    ]).toArray();

    return ctx.render({ alternatives: list, page, totalCount, totalPages });
  },
};

export default function Alternative({ data, state }) {
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
                {state.locale["Alternatives"]}
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

              <span>{state.locale["Suggest an alternative"]}</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col mt-6">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle px-6 md:px-6 lg:px-8">
              <AlternativesGrid alternatives={alternatives} state={state} />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center mt-6">
          {page > 1 && (
            <a
              href={`/alternative?page=${page - 1}`}
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
                {state.locale["Previous"]}
              </span>
            </a>
          )}

          <div class="items-center hidden lg:flex gap-x-3 flex-fill">
            {pagesToShow.map((pageItem) => (
              pageItem.label === page
                ? (
                  <span class="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60">
                    {pageItem.label}
                  </span>
                )
                : (
                  pageItem.type === "page"
                    ? (
                      <a
                        href={`/alternative?page=${pageItem.label}`}
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
              href={`/alternative?page=${page + 1}`}
              class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <span>
                {state.locale["Next"]}
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
