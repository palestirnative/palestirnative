import { AlternativeStatus, BoycottStatus } from "../../../types/boycott.ts";
import { Alternative } from "../../../types/alternative.ts";
import { ObjectId } from "mongodb";
import db from "../../../utils/db/db.ts";
import upload from "../../../utils/upload.ts";
import { Handler } from "$fresh/server.ts";
import { Boycott } from "../../../types/boycott.ts";
import AlternativesGrid from "../../../components/alternativesGrid.tsx";
import LabelLongTag from "../../../components/LabelLongTag.tsx";
import SuggestBoycott from "../../../islands/suggest-boycott.tsx";

export const handler: Handler = {
  async GET(req, ctx) {
    const nameSlug = ctx.params.id;

    const alternative = await db
      .collection<Alternative>("alternatives")
      .findOne({ nameSlug });

    if (!alternative) {
      throw new Deno.errors.NotFound();
    }

    alternative.boycotts = await db
      .collection<Boycott>("boycotts")
      .find({
        "alternatives.alternative": alternative._id,
      })
      .toArray();

    const boycotts = await db
      .collection<Boycott>("boycotts")
      .find()
      .toArray();

    return ctx.render({ alternative, boycotts });
  },
};

export default function BoycottPage({ data, state }) {
  const { boycotts, alternative } = data;

  return (
    <div class="container mx-auto my-20">
      <div class="flex flex-col items-center gap-6">
        <img
          class="w-36 h-36 rounded-full object-contain"
          src={alternative.logoURL}
          alt={alternative.name}
        />
        <div class="text-3xl font-bold">
          {alternative.name}
        </div>
        <div class="my-4">
          <LabelLongTag label={alternative.label} />
        </div>
        <a
          href={alternative.website}
          target="_blank"
          class="text-blue-500 hover:underline"
        >
          {alternative.website}
        </a>
      </div>
      <div class="flex justify-center items-center my-6 flex-wrap gap-4">
        {alternative.countries.map((country) => (
          <img
            src={`/flags/${country}.svg`}
            alt={`${country} flag`}
            class="w-6 h-6 mx-1 rounded-full object-contain"
          />
        ))}
      </div>
      <hr class="my-4" />
      <div class="my-6">
        <div class="flex justify-between items-center">
          <div class="text-lg font-bold">{state.locale["Alternative to"]}</div>
          <SuggestBoycott
            boycotts={boycotts}
            state={state}
            alternative={alternative}
          />
        </div>
        <div class="my-6">
          <div class="grid gap-4 grid-flow-col auto-cols-max overflow-y-auto">
            {alternative.boycotts.map((boycott) => {
              const status = boycott.alternatives.find((alt) =>
                alt.alternative.toString() === alternative._id.toString()
              )?.status;

              return (
                <a
                  href={`/boycott/${boycott.nameSlug}`}
                  class="relative justify-center flex flex-col bg-white rounded-xl shadow hover:bg-gray-100 cursor-pointer items-center border-x border border-gray-200 px-4 py-2 w-64 h-64 my-2"
                  style={{
                    opacity: status === AlternativeStatus.Pending ? 0.5 : 1,
                  }}
                >
                  {status === AlternativeStatus.Pending && (
                    <span class="absolute top-2 left-2 text-xs text-gray-700 text-center w-full">
                      {state.locale["Waiting for approval"]}
                    </span>
                  )}
                  <img
                    src={boycott.logoURL}
                    alt={boycott.name}
                    class="h-36 w-36 rounded-full mb-2 mt-6 object-contain"
                  />
                  <span class="text-creepy text-2xl text-red-700 absolute -rotate-45 bg-white bg-opacity-50 left-6 top-24 p-2 border-4 border-red-700">
                    CRIMINALS
                  </span>
                  <span class="text-creepy text-red-700">
                    {boycott.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
