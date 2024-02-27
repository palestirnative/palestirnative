import AlternativeFormIsland from "../../islands/form/alternative-form.tsx";
import db from "../../utils/db/db.ts";
import { ObjectId } from "mongodb";

export const handler: Handlers = {
  async GET(req, ctx) {
    const id = new URL(req.url).searchParams.get("id");

    const boycotts = await db.collection("boycotts").find().toArray();

    let toBeUpdated;
    if (id) {
      toBeUpdated = await db.collection("alternatives").findOne({
        _id: new ObjectId(id),
      });
      toBeUpdated.boycotts = await db.collection("boycotts").find({
        "alternatives.alternative": toBeUpdated._id,
      }).toArray();
    }

    return ctx.render({ toBeUpdated, boycotts });
  },
};

export default function AlternativeForm({ data }) {
  const { toBeUpdated, boycotts } = data;

  return (
    <>
      <section class="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-md shadow-md dark:bg-gray-800">
        <h2 class="text-lg font-semibold text-gray-700 capitalize dark:text-white">
          New Alternative
        </h2>

        <AlternativeFormIsland
          toBeUpdated={toBeUpdated}
          boycotts={boycotts}
        />
      </section>
    </>
  );
}
