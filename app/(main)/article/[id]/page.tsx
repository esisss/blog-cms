"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { EditArticleModal } from "@/features/articles/EditArticleModal";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/lib/trpc/client";
import {
  ArticlePageContent,
  ArticlePageError,
  ArticlePageSkeleton,
} from "@/features/articles/ArticlePageContent";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params.id ?? "";
  const isEditMode = searchParams.get("edit") === "true";

  const trpc = useTRPC();
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    ...trpc.articles.getArticleById.queryOptions({ id }),
    enabled: id.length > 0,
  });

  const { data: author } = useQuery({
    ...trpc.authors.getAuthorById.queryOptions({ id: data?.authorId ?? "" }),
    enabled: !!data?.authorId,
  });

  if (isLoading) {
    return <ArticlePageSkeleton />;
  }

  if (error || !data) {
    return <ArticlePageError />;
  }

  const isOwner = session?.user?.id === data.authorId;
  const showEditModal = isEditMode && isOwner;

  return (
    <>
      <ArticlePageContent article={data} author={author} />
      {showEditModal && (
        <EditArticleModal
          article={{
            id: data.id,
            title: data.title,
            text: data.text,
            coverImageUrl: data.coverImageUrl,
          }}
        />
      )}
    </>
  );
}
