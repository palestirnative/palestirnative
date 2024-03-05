import { load } from "$std/dotenv/mod.ts";
import { MongoClient } from "mongodb";

const env = {
  ...(await load()),
  ...Deno.env.toObject(),
};

if (!env.DB_URI) {
  throw new Error("Please define the DB_URI environment variable");
}

const dbClient = new MongoClient(env.DB_URI);
await dbClient.connect();

const dbName = env.ENV === "staging" ? env.DB_BACKUP_NAME : env.DB_NAME;

const db = dbClient.db(dbName);

export default db;
