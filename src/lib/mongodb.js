

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not defined");

let cached = global._mongoCache;
if (!cached) {
  cached = { conn: null, promise: null };
  global._mongoCache = cached;
}

export default async function getDB() {
  if (cached.conn) {
    return { client: cached.conn, db: cached.conn.db("sub_nex_web") };
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, { maxPoolSize: 10 });
    cached.promise = client
      .connect()
      .then((connectedClient) => {
        cached.conn = connectedClient;
        return connectedClient;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  const client = await cached.promise;
  const db = client.db("sub_nex_web");
  return { client, db };
}





