"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTRPC } from "@/lib/trpc/client";
import {
  ArticlePageContent,
  ArticlePageError,
  ArticlePageSkeleton,
} from "@/features/articles/ArticlePageContent";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery({
    ...trpc.articles.getArticleById.queryOptions({ id }),
    enabled: id.length > 0,
  });

  console.log("Article data:", data);

  if (isLoading) {
    return <ArticlePageSkeleton />;
  }

  if (error || !data) {
    return <ArticlePageError />;
  }

  return <ArticlePageContent article={data} />;
}
