import BoycottFormIsland from "../../islands/form/boycott-form.tsx";
import db from "../../utils/db/db.ts";
import { ObjectId } from "mongodb";

export const handler: Handlers = {
  async GET(req, ctx) {
    const categories = await db.collection("categories").find().toArray();
    const alternatives = await db.collection("alternatives").find().toArray();

    return ctx.render({ categories, alternatives });
  },
};

export default function BoycottForm({ data, state }) {
  const { categories, alternatives } = data;

  return (
    <>
      <section class="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md dark:bg-gray-800">
        <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          {state.locale["Suggest a boycott"]}
        </h2>

        <BoycottFormIsland
          categories={categories}
          alternatives={alternatives}
          state={state}
        />
      </section>
    </>
  );
}
