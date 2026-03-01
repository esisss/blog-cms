"use client";

import { useQuery } from "@tanstack/react-query";
import Feed, { FeedSkeleton } from "@/components/Feed";
import { useTRPC } from "@/lib/trpc/client";

export default function HomeFeed() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.articles.getArticles.queryOptions({ page: 1, pageSize: 10 }),
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

  return <Feed articles={data?.items ?? []} />;
}
