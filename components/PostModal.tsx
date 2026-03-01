"use client";

import { useRouter } from "next/navigation";
import { ArticleForm } from "@/features/articles/ArticleForm";
import { toggleCreatePostParam } from "@/lib/utils/url";

export function PostModal() {
  const router = useRouter();

  const handleClose = () => {
    router.push(toggleCreatePostParam(window.location.href, false));
  };

  // const handleSuccess = (insertedId: string) => {
  //   router.push(`/article/${insertedId}`);
  //   router.refresh();
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card bg-base-100 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-2xl font-bold">
              Create New Article
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
          <ArticleForm />
        </div>
      </div>
    </div>
  );
}
