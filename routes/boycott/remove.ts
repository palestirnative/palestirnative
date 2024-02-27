import db from "../../utils/db/db.ts";
import { ObjectId } from "mongodb";

export const handler: Handler = {
  async GET(req, ctx) {
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      throw new Error("Missing id");
    }

    const removeResult = await db.collection("boycotts").deleteOne({
      _id: new ObjectId(id),
    })

    if (!removeResult.acknowledged) {
      throw new Deno.errors.NotFound();
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/boycott",
      },
    })

  }
}
