import { AlternativeStatus, BoycottStatus } from "../../types/boycott.ts";
import { Alternative } from "../../types/alternative.ts";
import { ObjectId } from "mongodb";
import db from "../../utils/db/db.ts";
import upload from "../../utils/upload.ts";

export const handler: Handler = {
  async PUT(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    const id = ctx.params.id;

    const allowedFields = [
      "name",
      "reasonURL",
      "categories",
      "alternatives",
    ];

    const updateData: Partial<BoycottCreationData> = {};

    for (const field of allowedFields) {
      if (form.get(field)) {
        updateData[field] = form.get(field);
      }
    }

    if (updateData.alternatives) {
      try {
        const parsedAlternatives = updateData.alternatives.split(",").filter(Boolean).map((alternative) => {
          return {
            alternative: new ObjectId(alternative),
            status: AlternativeStatus.Approved,
          }; 
        });
        updateData.alternatives = parsedAlternatives;
      } catch (e) {
        return new Response("Invalid alternatives", {
          status: 400,
        });
      }
    }

    try {
      if (updateData.categories) {
        updateData.categories = (form.get("categories") ?? "").split(",").map((
          category: string,
        ) => new ObjectId(category));
      }
    } catch(e) {
      return new Response("Invalid categories", {
        status: 400,
      });
    }

    if (updateData.name) {
      updateData.nameSlug = updateData.name.toLowerCase().replace(/\s+/g, "-");
    }

    const existingSlug = await db.collection("boycotts").findOne({
      nameSlug: updateData.nameSlug,
      _id: { $ne: new ObjectId(id) },
    });

    if (existingSlug) {
      return new Response("Slug already exists", {
        status: 400,
      });
    }

    const categories = await db.collection("categories").find({
      _id: { $in: updateData.categories },
    }).toArray();

    if (categories.length !== updateData.categories.length) {
      return new Response("Invalid category IDs", {
        status: 400,
      });
    }

    const logo = form.get("logo") as File;

    if (logo instanceof File && logo.type.startsWith("image/")) {
      const uploadResult = await upload(logo);
      const logoURL = `https://ucarecdn.com/${uploadResult?.File}/`;

      if (!logoURL) {
        return new Response("Failed to upload logo", {
          status: 500,
        });
      }

      updateData.logoURL = logoURL;
    }


    const updateResult = await db.collection("boycotts").updateOne({
      _id: new ObjectId(id),
    }, { $set: updateData });

    if (!updateResult.acknowledged) {
      return new Response("Failed to update boycott", {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        ...updateData,
        _id: id,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  },
};
