"use client";

import type { Article } from "@/schemas";
import ArticleCard from "./ArticleCard";

type SerializedArticle = Omit<Article, "createdAt"> & {
  createdAt: string | Date;
};

interface FeedProps {
  articles: SerializedArticle[];
}

export function FeedSkeleton() {
  return (
    <div className="h-44 flex flex-col gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card h-44 bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="skeleton w-16 h-16 shrink-0 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton h-6 w-3/4"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-4 w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Feed({ articles }: FeedProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-base-content/50 text-lg">No articles yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
