import { Handler } from "$fresh/server.ts";
import upload from "../../utils/upload.ts";
import db from "../../utils/db/db.ts";
import { ObjectId } from "mongodb";
import { AlternativeStatus } from "../../types/boycott.ts";

export const handler: Handler = {
  async PUT(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    const id = ctx.params.id;

    const allowedFields = [
      "name",
      "countries",
    ];

    const alternative = {};

    for (const field of allowedFields) {
      if (form.get(field)) {
        alternative[field] = form.get(field);
      }
    }

    const boycotts = form.get("boycotts")?.split(",").filter(Boolean).map((boycott) => {
      return new ObjectId(boycott);      
    });

    alternative.countries = alternative.countries?.split(",").filter(Boolean);

    const allAreCountryCodes = alternative.countries.every((country) => {
      return /^[a-z]{2}$/.test(country);
    })

    if (alternative.countries.length === 0 || !allAreCountryCodes) {
      return new Response("Invalid countries", {
        status: 400,
      });
    }

    if (boycotts && boycotts.length === 0) {
      return new Response("Invalid boycotts", {
        status: 400,
      });
    }

    if (alternative.name) {
      alternative.nameSlug = alternative.name.toLowerCase().replace(
        /\s+/g,
        "-",
      );
    }

    const existingSlug = await db.collection("alternatives").findOne({
      nameSlug: alternative.nameSlug,
      _id: { $ne: new ObjectId(id) },
    });

    if (existingSlug) {
      return new Response("Slug already exists", {
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

      alternative.logoURL = logoURL;
    }

    const updateResult = await db.collection("alternatives").updateOne({
      _id: new ObjectId(id),
    }, {
      $set: alternative,
    });

    if (!updateResult.acknowledged) {
      return new Response("Failed to create alternative", {
        status: 500,
      });
    }

    await db.collection("boycotts").updateMany({
      "alternatives.alternative": new ObjectId(id),
    }, {
      $pull: {
        alternatives: { alternative: new ObjectId(id) },
      }
    })

    const updateBoycottsResult = await db.collection("boycotts").updateMany({
      _id: { $in: boycotts },
    }, {
      $push: {
        alternatives: {
          alternative: new ObjectId(id),
          status: AlternativeStatus.Approved,
        },
      },
    });

    return new Response(JSON.stringify(alternative), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
