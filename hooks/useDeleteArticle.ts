"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useArticleMutations } from "./useArticleMutations";

interface UseDeleteArticleOptions {
  articleId: string;
  redirectTo?: string;
}

export function useDeleteArticle({
  articleId,
  redirectTo = "/",
}: UseDeleteArticleOptions) {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { deleteArticle } = useArticleMutations();

  const handleDelete = async () => {
    try {
      await deleteArticle.mutateAsync({ id: articleId });
      toast.success("Article deleted successfully!");
      router.push(redirectTo);
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setShowConfirm(false);
    }
  };

  return {
    showConfirm,
    setShowConfirm,
    handleDelete,
    isDeleting: deleteArticle.isPending,
  };
}
