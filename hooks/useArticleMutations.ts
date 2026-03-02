"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTRPC } from "@/lib/trpc/client";

/**
 * Centralized hook for all article mutations.
 * Handles cache invalidation automatically after each mutation.
 */
export function useArticleMutations() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  /**
   * Invalidates all article-related queries.
   * Used after create/update/delete operations.
   */
  const invalidateArticleQueries = useCallback(
    async (articleId?: string) => {
      const invalidations = [
        queryClient.invalidateQueries({
          queryKey: trpc.articles.getArticles.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: trpc.articles.getArticlesByAuthor.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: trpc.authors.getAuthors.queryKey(),
        }),
      ];

      // If articleId provided, also invalidate the specific article query
      if (articleId) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: trpc.articles.getArticleById.queryKey({ id: articleId }),
          })
        );
      }

      await Promise.all(invalidations);
    },
    [queryClient, trpc]
  );

  const createArticle = useMutation(
    trpc.articles.createArticle.mutationOptions({
      onSuccess: () => invalidateArticleQueries(),
    })
  );

  const updateArticle = useMutation(
    trpc.articles.updateArticle.mutationOptions({
      onSuccess: (_data, variables) => invalidateArticleQueries(variables.id),
    })
  );

  const deleteArticle = useMutation(
    trpc.articles.deleteArticle.mutationOptions({
      onSuccess: (_data, variables) => invalidateArticleQueries(variables.id),
    })
  );

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    invalidateArticleQueries,
  };
}
