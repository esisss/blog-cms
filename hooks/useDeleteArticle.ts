"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTRPC } from "@/lib/trpc/client";

interface UseDeleteArticleOptions {
  articleId: string;
  redirectTo?: string;
}

export function useDeleteArticle({ articleId, redirectTo = "/" }: UseDeleteArticleOptions) {
  const [showConfirm, setShowConfirm] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation(
    trpc.articles.deleteArticle.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.articles.getArticles.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.authors.getAuthors.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.articles.getArticlesByAuthor.queryKey(),
          }),
        ]);
        toast.success("Article deleted successfully!");
        router.push(redirectTo);
      },
      onError: () => {
        toast.error("Failed to delete article");
      },
    })
  );

  const handleDelete = () => {
    deleteMutation.mutate({ id: articleId });
    setShowConfirm(false);
  };

  return {
    showConfirm,
    setShowConfirm,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
