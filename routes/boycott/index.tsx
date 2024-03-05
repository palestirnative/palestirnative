import { Handler } from "$fresh/server.ts";
import {
  AlternativeStatus,
  BoycottCreationData,
  BoycottStatus,
} from "../../types/boycott.ts";
import {
  CalendarSolid,
  CheckBadgeSolid,
  TagSolid,
} from "https://esm.sh/preact-heroicons";
import upload from "../../utils/upload.ts";
import { ObjectId } from "mongodb";
import db from "../../utils/db/db.ts";
import LabelTag from "../../components/LabelTag.tsx";
import slugify from "../../utils/slugify.ts";

export const handler: Handler = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();

    const requiredFields = [
      "name",
      "reasonurl",
      "logo",
      "categories",
    ];

    for (const field of requiredFields) {
      if (!form.get(field)) {
        return new Response(`Missing required field: ${field}`, {
          status: 400,
        });
      }
    }

    const logo = form.get("logo") as File;

    if ((!logo) instanceof File || !logo.type.startsWith("image/")) {
      return new Response("Invalid logo file", {
        status: 400,
      });
    }

    const formAlternatives = form.get("alternatives") as string;
    const boycott: BoycottCreationData = {
      name: form.get("name"),
      nameSlug: slugify(form.get("name")),
      reasonURL: form.get("reasonurl"),
      categories: (form.get("categories") ?? "").split(",").map((
        category: string,
      ) => new ObjectId(category)),
      status: BoycottStatus.Pending,
      alternatives: formAlternatives.split(",").filter(Boolean)
        .map((alternative: string) => ({
          alternative,
          status: AlternativeStatus.Pending,
        })),
      createdAt: new Date(),
    };

    const existingSlug = await db.collection("boycotts").findOne({
      nameSlug: boycott.nameSlug,
    });

    if (existingSlug) {
      return new Response("Name already exists", {
        status: 400,
      });
    }

    const categories = await db.collection("categories").find({
      _id: { $in: boycott.categories },
    }).toArray();

    if (categories.length !== boycott.categories.length) {
      return new Response("Invalid category IDs", {
        status: 400,
      });
    }

    const alternatives = await db.collection("alternatives").find({
      _id: {
        $in: boycott.alternatives.map((alternative) => alternative.alternative),
      },
    }).toArray();

    if (alternatives.length !== boycott.alternatives.length) {
      return new Response("Invalid alternative IDs", {
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

    boycott.logoURL = logoURL;

    const insertResult = await db.collection("boycotts").insertOne(boycott);

    if (!insertResult.acknowledged) {
      return new Response("Failed to create boycott", {
        status: 500,
      });
    }

    const insertedBoycott: Boycott = {
      ...boycott,
      _id: insertResult.insertedId,
    };

    return new Response(JSON.stringify(insertedBoycott), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
  async GET(req, ctx) {
    const url = new URL(req.url);
    let page = parseInt(url.searchParams?.get("page"));

    if (isNaN(page)) {
      page = 1;
    }

    const totalCount = await db.collection("boycotts").countDocuments();
    const totalPages = Math.ceil(totalCount / 10) || 1;

    if (page > totalPages) {
      throw new Deno.errors.NotFound();
    }

    const list = await db.collection("boycotts").aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categories",
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
      {
        $lookup: {
          from: "alternatives",
          localField: "alternatives.alternative",
          foreignField: "_id",
          as: "attachedAlternatives",
        },
      },
      ...(ctx.state.search
        ? [{
          $match: {
            $or: [
              { name: { $regex: ctx.state.search, $options: "i" } },
              {
                "attachedAlternatives.name": {
                  $regex: ctx.state.search,
                  $options: "i",
                },
              },
              {
                "categories.name": { $regex: ctx.state.search, $options: "i" },
              },
            ],
          },
        }]
        : []),
      ...(ctx.state.country
        ? [{
          $match: {
            "attachedAlternatives.countries": ctx.state.country.toLowerCase(),
          },
        }]
        : []),
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
    ]).toArray();

    return ctx.render({ boycotts: list, page, totalCount, totalPages });
  },
};

export default function Boycott({ data, state }) {
  const { boycotts, page, totalCount, totalPages } = data;

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
// sm:overflow-x-auto md:overflow-x-auto
  return (
    <>
      <section class="container px-4 mx-auto mt-10">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-x-3">
              <h2 class="text-lg font-medium text-gray-800 dark:text-white">
                {state.locale["Boycotts"]}
              </h2>

              <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                {totalCount}
              </span>
            </div>
          </div>

          <div class="flex items-center mt-4 gap-x-3">
            <a
              href="/boycott/form"
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

              <span>{state.locale["Suggest a boycott"]}</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col my-8">
          {boycotts.map((boycott) => (
            <div class="flex my-4 border border-gray-200 shadow-sm bg-white rounded-lg">
              <div>
                <div class="flex items-center border-e border-gray-200 justify-center px-4 py-2">
                  <span class="font-medium text-lg w-full">
                    {state.locale["Replace these criminals"]}:
                  </span>
                </div>
                <div class="flex">
                  <div class="flex flex-col justify-center items-center border-e border-gray-200 px-4 py-2 w-72 h-72 relative">
                    {boycott.status === BoycottStatus.Pending && (
                      <span class="absolute top-2 left-2 text-xs text-gray-700">
                        {state.locale["Waiting for approval"]}
                      </span>
                    )}
                    <a
                      href={`/boycott/${boycott.nameSlug}`}
                      class="relative mb-2 mt-6"
                    >
                      <img
                        src={boycott.logoURL}
                        alt={boycott.name}
                        class="w-36 h-36 rounded-full grayscale"
                      />
                      <span class="text-creepy text-2xl text-red-700 absolute -rotate-45 bg-white bg-opacity-50 -left-6 top-6 p-2 border-4 border-red-700">
                        CRIMINALS
                      </span>
                    </a>
                    <a
                      href={`/boycott/${boycott.nameSlug}`}
                      class="text-creepy text-red-700"
                    >
                      {boycott.name}
                    </a>
                    <a
                      href={boycott.reasonURL}
                      target="_blank"
                      class="text-blue-500 hover:underline"
                    >
                      {state.locale["See reason"]}...
                    </a>
                  </div>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between px-4 py-2 w-full">
                  <span class="font-medium text-lg">
                    {state.locale["By these"]}:
                  </span>
                  <div class="flex flex-wrap gap-4 sm:gap-0">
                    {boycott.categories.map((category) => (
                      <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div class="flex overflow-x-auto">
                  {boycott.attachedAlternatives.map((alternative) => {
                    const status = boycott.alternatives.find((a) =>
                      a.alternative.toString() === alternative._id.toString()
                    ).status;
                    return (
                      <a
                        href={`/alternative/${alternative.nameSlug}`}
                        class="flex flex-col hover:bg-gray-100 cursor-pointer items-center border-x border-t border-gray-200 px-4 py-2 min-w-72 h-72 relative"
                        style={{
                          opacity: status === AlternativeStatus.Pending
                            ? 0.5
                            : 1,
                        }}
                      >
                        {status === AlternativeStatus.Pending && (
                          <span class="absolute top-2 left-2 text-xs text-gray-700">
                            {state.locale["Waiting for approval"]}
                          </span>
                        )}
                        <div class="absolute top-2 right-2">
                          {<LabelTag label={alternative.label} />}
                        </div>
                        <img
                          src={alternative.logoURL}
                          alt={alternative.name}
                          class="w-36 h-36 rounded-full mb-2 mt-6"
                        />
                        <span class="font-medium text-2xl">
                          {alternative.name}
                        </span>
                        <div class="flex my-2">
                          {alternative.countries.slice(0, 3).map((country) => (
                            <img
                              src={`/flags/${country}.svg`}
                              alt={`${country} flag`}
                              class="w-6 h-6 mx-1 rounded-full"
                            />
                          ))}
                          {alternative.countries.length > 3 && (
                            <>
                              <span class="text-gray-400">...</span>
                              <div class="w-6 h-6 mx-1 rounded-full bg-green-800">
                                <span class="text-white text-xs font-bold">+{alternative.countries.length - 3}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div class="flex items-center justify-center mt-6">
          {page > 1 && (
            <a
              href={`/boycott?page=${page + 1}`}
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
