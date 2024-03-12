import { Handlers } from "$fresh/server.ts";
import AlternativeFormIsland from "../../islands/form/alternative-form.tsx";
import { Boycott } from "../../types/boycott.ts";
import db from "../../utils/db/db.ts";
import { AppState } from "../_middleware.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const boycotts = await db.collection("boycotts").find().toArray();

    return ctx.render({ boycotts });
  },
};

export default function AlternativeForm({ data, state }: {
  data: {
    boycotts: Boycott[];
  };
  state: AppState;
}) {
  const { boycotts } = data;

  return (
    <>
      <section class="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md dark:bg-gray-800">
        <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          {state.locale["Suggest a alternative"]}
        </h2>

        <AlternativeFormIsland
          state={state}
          boycotts={boycotts}
        />
      </section>
    </>
  );
}
