"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { useDeleteArticle } from "@/hooks/useDeleteArticle";
import { useSession } from "@/lib/auth-client";

interface Article {
  id: string;
  title: string;
  text: string;
  coverImageUrl: string | null;
  createdAt: string;
  authorId: string;
}

export function ArticlePageContent({ article }: { article: Article }) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === article.authorId;
  const { showConfirm, setShowConfirm, handleDelete, isDeleting } =
    useDeleteArticle({ articleId: article.id });

  const authorPlaceholder = {
    name: "Autor desconocido",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Autor+Desconocido&background=random&size=128",
  };

  return (
    <article className="w-full max-w-3xl mx-auto px-4 md:px-0 ">
      {article.coverImageUrl && (
        <div className="relative w-full h-48 md:h-80 mb-6 md:mb-8 rounded-xl md:rounded-2xl overflow-hidden">
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mb-6 md:mb-8">
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <h1 className="text-2xl md:text-4xl font-bold">{article.title}</h1>
          {isOwner && (
            <div className="flex gap-2">
              <Link
                href={`/article/${article.id}?edit=true`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <Image
                src={authorPlaceholder.avatarUrl}
                alt={authorPlaceholder.name}
                width={48}
                height={48}
              />
            </div>
          </div>
          <div>
            <p className="font-medium">{authorPlaceholder.name}</p>
            <p className="text-sm text-base-content/60">
              {new Date(article.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      <div className="prose prose-base md:prose-lg max-w-none">
        <p className="whitespace-pre-wrap leading-relaxed">{article.text}</p>
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

export function ArticlePageSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 ">
      <div className="h-48 md:h-80 bg-base-300 animate-pulse rounded-xl md:rounded-2xl mb-6 md:mb-8"></div>

      <div className="mb-6 md:mb-8">
        <div className="skeleton h-8 md:h-10 w-3/4 mb-4 md:mb-6"></div>

        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-base-300 w-12 rounded-full">
              <span className="text-xs">?</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-3 w-40"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="skeleton h-5 w-full"></div>
        <div className="skeleton h-5 w-full"></div>
        <div className="skeleton h-5 w-full"></div>
        <div className="skeleton h-5 w-3/4"></div>
        <div className="skeleton h-5 w-5/6"></div>
      </div>
    </div>
  );
}

export function ArticlePageError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <h2 className="text-2xl font-bold text-error mb-2">Error</h2>
      <p className="text-base-content/60">No se pudo encontrar el articulo</p>
    </div>
  );
}
