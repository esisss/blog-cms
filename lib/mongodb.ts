import { MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
const options: MongoClientOptions = {
  appName: "blog-cms-app",
};

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = globalThis as unknown as GlobalWithMongo;

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getClient(): Promise<MongoClient> {
  try {
    const connectedClient = await clientPromise;
    return connectedClient;
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
}

export async function ping(): Promise<void> {
  const client = await getClient();
  await client.db("admin").command({ ping: 1 });
}

export default clientPromise;
