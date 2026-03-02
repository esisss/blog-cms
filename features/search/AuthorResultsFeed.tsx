"use client";

import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import type { AuthorWithCount } from "@/schemas";

interface AuthorResultsFeedProps {
  authors: AuthorWithCount[];
  currentPage: number;
  totalPages: number;
  query: string;
}

export function AuthorResultsFeed({
  authors,
  currentPage,
  totalPages,
  query,
}: AuthorResultsFeedProps) {
  if (authors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-base-content/50 text-lg mb-4">No authors found</p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const buildPageUrl = (page: number) => {
    return `/search?q=${encodeURIComponent(query)}&type=authors&page=${page}`;
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/profile/${author.id}`}
            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="card-body flex-row items-center gap-4">
              <div className="avatar">
                <div className="w-14 rounded-full">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      author.name
                    )}&background=random&size=128`}
                    alt={author.name}
                    width={56}
                    height={56}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{author.name}</h3>
                <p className="text-sm text-base-content/60 truncate">{author.email}</p>
                <div className="badge badge-ghost mt-1">
                  {author.articleCount} {author.articleCount === 1 ? "article" : "articles"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildUrl={buildPageUrl}
      />
    </div>
  );
}
