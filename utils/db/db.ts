import { load } from "$std/dotenv/mod.ts";
import { MongoClient } from "mongodb";

const env = {
  ...(await load()),
  ...Deno.env.toObject(),
};

async function getClient(){
  if (!env.DB_URI) {
    throw new Error("Please define the DB_URI environment variable");
  }

  const dbClient = new MongoClient(env.DB_URI);
  await dbClient.connect();
  return dbClient.db(env.DB_NAME);
}

export default await getClient();
