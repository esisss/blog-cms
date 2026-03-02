"use client";

import Link from "next/link";
import Feed from "@/components/Feed";
import Pagination from "@/components/Pagination";
import type { Article } from "@/schemas";

type SerializedArticle = Omit<Article, "createdAt"> & {
  createdAt: string | Date;
};

interface SearchResultsFeedProps {
  articles: SerializedArticle[];
  currentPage: number;
  totalPages: number;
  query: string;
  type: string;
}

export function SearchResultsFeed({
  articles,
  currentPage,
  totalPages,
  query,
  type,
}: SearchResultsFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-base-content/50 text-lg mb-4">No articles found</p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const buildPageUrl = (page: number) => {
    return `/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}`;
  };

  return (
    <div>
      <Feed articles={articles} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildUrl={buildPageUrl}
      />
    </div>
  );
}
