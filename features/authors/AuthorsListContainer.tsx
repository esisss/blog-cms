"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import AuthorsList, { AuthorsListSkeleton } from "@/components/AuthorsList";

export default function AuthorsListContainer() {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.authors.getAuthors.queryOptions(),
  );

  if (isLoading) {
    return <AuthorsListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-3xl mb-8">Authors</h3>
        <div className="card bg-base-100 shadow-md p-4">
          <p className="text-error text-sm">Failed to load authors</p>
        </div>
      </div>
    );
  }

  return <AuthorsList authors={data ?? []} />;
}
