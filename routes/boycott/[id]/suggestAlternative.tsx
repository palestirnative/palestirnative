import { Handlers } from "$fresh/server.ts";
import { ObjectId } from "mongodb";
import { Alternative } from "../../../types/alternative.ts";
import { AlternativeStatus, Boycott } from "../../../types/boycott.ts";
import db from "../../../utils/db/db.ts";
import slugify from "../../../utils/slugify.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();

    const alternativeName = form.get("alternative") as string;
    const alternativeNameSlug = slugify(alternativeName)
      .toLowerCase();
    const alternative = await db
      .collection<Alternative>("alternatives")
      .findOne({ nameSlug: alternativeNameSlug });

    if (!alternative) {
      return new Response("Alternative not found", {
        status: 404,
      });
    }

    const boycottId = new ObjectId(ctx.params.id);

    const updateResult = await db
      .collection<Boycott>("boycotts")
      .updateOne(
        { _id: boycottId, alternatives: { $ne: alternative._id } },
        {
          $set: {
            updatedAt: new Date(),
          },
          $push: {
            alternatives: {
              alternative: alternative._id,
              status: AlternativeStatus.Pending,
            },
          },
        },
      );

    if (updateResult.modifiedCount === 0) {
      return new Response("Alternative already suggested", {
        status: 400,
      });
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: req.headers.get("referer"),
      },
    });
  },
};
