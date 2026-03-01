import { headers } from "next/headers";
import { auth } from "@/server/auth/auth";
import { getDb } from "@/server/db/mongodb";

export async function createTRPCContext() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const db = await getDb();

    return { session, db };
  } catch (error) {
    return { session: null, db: null, contextError: error };
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
