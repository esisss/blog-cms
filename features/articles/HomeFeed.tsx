"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Feed, { FeedSkeleton } from "@/components/Feed";
import { useTRPC } from "@/lib/trpc/client";

const PAGE_SIZE = 10;

export default function HomeFeed() {
  const [page, setPage] = useState(1);
  const trpc = useTRPC();

  const { data, isLoading, error, isFetching } = useQuery(
    trpc.articles.getArticles.queryOptions({ page, pageSize: PAGE_SIZE }),
  );

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
