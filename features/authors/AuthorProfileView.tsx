"use client";

import { useQuery } from "@tanstack/react-query";
import AuthorFeed from "@/features/authors/AuthorFeed";
import { useTRPC } from "@/lib/trpc/client";
import AuthorProfileCard, {
  AuthorProfileCardSkeleton,
} from "@/components/AuthorProfileCard";

interface AuthorProfileViewProps {
  authorId: string;
}

export default function AuthorProfileView({
  authorId,
}: AuthorProfileViewProps) {
  const trpc = useTRPC();
  const {
    data: author,
    isLoading,
    error,
  } = useQuery(trpc.authors.getAuthorById.queryOptions({ id: authorId }));

  if (isLoading) {
    return (
      <div className="space-y-8">
        <AuthorProfileCardSkeleton />
        <div>
          <div className="skeleton h-8 w-64 mb-6"></div>
          <AuthorFeed authorId={authorId} />
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-error text-lg">Author not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AuthorProfileCard author={author} />
      <div>
        <h2 className="text-2xl font-bold mb-6">Articles by {author.name}</h2>
        <AuthorFeed authorId={authorId} />
      </div>
    </div>
  );
}
