"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";

/**
 * Hook to fetch all authors with article counts.
 */
export function useAuthors() {
  const trpc = useTRPC();

  return useQuery(trpc.authors.getAuthors.queryOptions());
}

/**
 * Hook to fetch a single author profile by ID.
 */
export function useAuthorById(authorId: string) {
  const trpc = useTRPC();

  return useQuery(trpc.authors.getAuthorById.queryOptions({ id: authorId }));
}

/**
 * Hook to fetch articles by a specific author with pagination.
 */
export function useArticlesByAuthor(authorId: string, page: number, pageSize: number = 10) {
  const trpc = useTRPC();

  return useQuery(
    trpc.articles.getArticlesByAuthor.queryOptions({
      authorId,
      page,
      pageSize,
    })
  );
}
