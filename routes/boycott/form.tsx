import BoycottFormIsland from "../../islands/form/boycott-form.tsx";
import db from "../../utils/db/db.ts";
import { ObjectId } from "mongodb"

export const handler: Handlers = {
  async GET(req, ctx) {
    const categories = await db.collection("categories").find().toArray();
    const alternatives = await db.collection("alternatives").find().toArray();

    const id = new URL(req.url).searchParams.get("id");

    let toBeUpdated;
    if (id) {
      toBeUpdated = await db.collection("boycotts").findOne({ _id: new ObjectId(id) })
    }

    return ctx.render({ categories, alternatives, toBeUpdated });
  },
};

export default function BoycottForm({ data }) {
  const { categories, alternatives, toBeUpdated } = data;

  return (
    <>
      <section class="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md dark:bg-gray-800">
        <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          New Boycott
        </h2>

        <BoycottFormIsland
          categories={categories}
          alternatives={alternatives}
          toBeUpdated={toBeUpdated}
        />
      </section>
    </>
  );
}
