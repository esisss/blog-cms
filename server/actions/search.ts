"use server";

import { getServerCaller } from "@/server/trpc";
import type { SearchPreview } from "@/schemas";

export async function searchPreviewAction(
  query: string
): Promise<SearchPreview | null> {
  if (!query || query.length < 1) {
    return null;
  }

  try {
    const caller = await getServerCaller();
    const preview = await caller.search.preview({ query });
    return preview;
  } catch (error) {
    console.error("Search preview error:", error);
    return null;
  }
}
