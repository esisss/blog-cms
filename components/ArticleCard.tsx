"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeleteArticle } from "@/hooks/useDeleteArticle";
import { useSession } from "@/lib/auth-client";
import type { Article } from "@/schemas";
import ArticleCardActions from "./ArticleCardActions";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type SerializedArticle = Omit<Article, "createdAt"> & {
  createdAt: string | Date;
};

interface ArticleCardProps {
  article: SerializedArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === article.authorId;
  const { showConfirm, setShowConfirm, handleDelete, isDeleting } =
    useDeleteArticle({ articleId: article.id });

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <article className="card card-side h-44 bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
      <figure className="w-32 md:w-48 shrink-0">
        <Image
          width={192}
          height={128}
          src={article.coverImageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body px-3 relative">
        <div className="flex flex-row justify-between gap-3">
          <h2 className="card-title line-clamp-2">{article.title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/50">
              {formattedDate}
            </span>
            {isOwner && (
              <ArticleCardActions
                articleId={article.id}
                onDelete={() => setShowConfirm(true)}
              />
            )}
          </div>
        </div>
        <Link href={`/article/${article.id}`}>
          <p className="text-base-content/70 line-clamp-3 wrap-break-words">
            {article.text}
          </p>
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-base-100 via-base-100/90 to-transparent h-24 flex items-end justify-end pb-2">
            <span className="font-bold text-secondary mx-5">Leer Articulo</span>
          </div>
        </Link>
      </div>

      <DeleteConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </article>
  );
}
