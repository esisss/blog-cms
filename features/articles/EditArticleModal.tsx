"use client";

import { useRouter } from "next/navigation";
import { ArticleForm } from "@/features/articles/ArticleForm";

interface EditArticleModalProps {
  article: {
    id: string;
    title: string;
    text: string;
    coverImageUrl: string;
  };
}

export function EditArticleModal({ article }: EditArticleModalProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push(`/article/${article.id}`);
  };

  const handleSuccess = () => {
    router.push(`/article/${article.id}`);
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card bg-base-100 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-2xl font-bold">Edit Article</h2>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
          <ArticleForm mode="edit" article={article} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
