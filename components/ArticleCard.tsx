"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeleteArticle } from "@/hooks/useDeleteArticle";
import { useSession } from "@/lib/auth-client";
import type { Article } from "@/schemas";
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
      <div className="card-body relative">
        <div className="flex flex-row justify-between">
          <h2 className="card-title line-clamp-2">{article.title}</h2>
          <div className="flex items-center  gap-2">
            {isOwner && (
              <div className="flex  items-end gap-1">
                <Link
                  href={`/article/${article.id}?edit=true`}
                  className="inline-flex items-center"
                >
                  <button
                    type="button"
                    className="inline-flex items-center text-xs text-secondary-content hover:font-bold gap-1 cursor-pointer"
                  >
                    <Pencil
                      size={14}
                      className="inline -translate-y-0.5 mx-1"
                    />
                    Editar
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                  }}
                  className="inline-flex items-center text-xs text-error hover:font-bold gap-1 cursor-pointer"
                >
                  <Trash2 size={14} className="inline -translate-y-0.5 mx-1" />
                  Eliminar
                </button>
              </div>
            )}
            <span className="text-sm text-base-content/50">
              - {formattedDate}
            </span>
          </div>
        </div>
        <Link href={`/article/${article.id}`}>
          <p className="text-base-content/70 line-clamp-3 wrap-break-words">
            {article.text}
          </p>
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-base-100 via-base-100/90 to-transparent h-24 flex items-end justify-center pb-2">
            <span className="font-bold text-secondary ">Leer Articulo</span>
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
