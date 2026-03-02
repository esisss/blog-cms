"use client";

import AuthorProfileCard, {
  AuthorProfileCardSkeleton,
} from "@/components/AuthorProfileCard";
import AuthorFeed from "@/features/authors/AuthorFeed";
import { useAuthorById } from "@/hooks/useAuthorQueries";

interface AuthorProfileViewProps {
  authorId: string;
}

export default function AuthorProfileView({
  authorId,
}: AuthorProfileViewProps) {
  const { data: author, isLoading, error } = useAuthorById(authorId);

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
        <h2 className="text-2xl font-bold mb-6">Artículos de {author.name}</h2>
        <AuthorFeed authorId={authorId} />
      </div>
    </div>
  );
}
