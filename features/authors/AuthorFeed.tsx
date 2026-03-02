"use client";

import { useState } from "react";
import { useArticlesByAuthor } from "@/hooks/useAuthorQueries";
import Feed, { FeedSkeleton } from "@/components/Feed";

const PAGE_SIZE = 10;

interface AuthorFeedProps {
  authorId: string;
}

export default function AuthorFeed({ authorId }: AuthorFeedProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useArticlesByAuthor(authorId, page, PAGE_SIZE);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-error">Failed to load articles</p>
      </div>
    );
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className={isFetching ? "opacity-60 pointer-events-none" : ""}>
      <Feed
        articles={data?.items ?? []}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
