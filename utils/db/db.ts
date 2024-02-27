import { load } from "$std/dotenv/mod.ts";
import { MongoClient } from "mongodb";

const env = {
  ...(await load()),
  ...Deno.env.toObject(),
};

async function getClient() {
  if (!env.DB_URI) {
    console.warn("No DB_URI found. Please set it in your .env file.");
    return {};
  }

  const dbClient = new MongoClient(env.DB_URI);
  await dbClient.connect();
  return dbClient.db(env.DB_NAME);
}

export default await getClient();
