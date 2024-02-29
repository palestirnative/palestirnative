import { AlternativeStatus, BoycottStatus } from "../../../types/boycott.ts";
import { Alternative } from "../../../types/alternative.ts";
import { ObjectId } from "mongodb";
import db from "../../../utils/db/db.ts";
import upload from "../../../utils/upload.ts";

export const handler: Handler = {
  async POST(req, ctx) {
    const form = await req.formData();

    const alternativeName = form.get("alternative");
    const alternativeNameSlug = alternativeName.replace(/\s+/g, "-")
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
