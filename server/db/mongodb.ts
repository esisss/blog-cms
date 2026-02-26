import { type Db, MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
const options: MongoClientOptions = {
  appName: "blog-cms-app",
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getClient(): Promise<MongoClient> {
  try {
    const connectedClient = await clientPromise;
    return connectedClient;
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`, { cause: error });
  }
}
export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB);
}

export async function ping(): Promise<void> {
  const client = await getClient();
  await client.db("admin").command({ ping: 1 });
}
