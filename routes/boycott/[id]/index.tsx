import { BoycottStatus } from "../../../types/boycott.ts";
import { Alternative } from "../../../types/alternative.ts";
import db from "../../../utils/db/db.ts";
import { Handler } from "$fresh/server.ts";
import { Boycott } from "../../../types/boycott.ts";
import AlternativesGrid from "../../../components/alternativesGrid.tsx";
import SuggestAlternative from "../../../islands/suggest-alternative.tsx";

export const handler: Handler = {
  async GET(req, ctx) {
    const nameSlug = ctx.params.id;

    const boycott = await db
      .collection<Boycott>("boycotts")
      .findOne({ nameSlug });

    if (!boycott) {
      throw new Deno.errors.NotFound();
    }

    boycott.attachedAlternatives = await db
      .collection<Alternative>("alternatives")
      .find({
        _id: { $in: boycott.alternatives.map((a) => a.alternative) },
      })
      .toArray();

    boycott.categories = await db
      .collection("categories")
      .find({ _id: { $in: boycott.categories } })
      .toArray();

    const alternatives = await db
      .collection<Alternative>("alternatives")
      .find()
      .toArray();

    return ctx.render({ boycott, alternatives });
  },
};

export default function BoycottPage({ data, state }) {
  const { boycott, alternatives } = data;

  return (
    <div class="container mx-auto my-20">
      <div class="flex flex-col items-center gap-6 relative">
        {boycott.status === BoycottStatus.Pending && (
          <span class="top-2 left-2 text-xs text-gray-700 text-center w-full">
            {state.locale["Waiting for approval"]}
          </span>
        )}
        <img
          class="w-36 h-36 rounded-full object-contain"
          src={boycott.logoURL}
          alt={boycott.name}
        />
        <div class="text-3xl font-bold text-red-800 text-creepy text-center">
          {boycott.name}
        </div>
        <a
          href={boycott.reasonURL}
          target="_blank"
          class="text-blue-500 hover:underline"
        >
          {state.locale["See reason"]}...
        </a>
      </div>
      <hr class="my-4" />
      <div class="my-6">
        <div class="flex justify-between items-center">
          <div class="text-lg font-bold">{state.locale["Alternatives"]}</div>
          <SuggestAlternative
            boycott={boycott}
            state={state}
            alternatives={alternatives}
          />
          {
            /* <div class="flex gap-4">
            {boycott.categories.map((category) => (
              <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                {category.name}
              </span>
            ))}
          </div> */
          }
        </div>
        <div class="my-6">
          <AlternativesGrid
            alternatives={boycott.attachedAlternatives.map((alternative) => ({
              ...alternative,
              status: boycott.alternatives.find((a) =>
                a.alternative.toString() === alternative._id.toString()
              ).status,
            }))}
            state={state}
            horizontal
          />
        </div>
      </div>
    </div>
  );
}
