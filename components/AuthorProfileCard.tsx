"use client";

import type { AuthorProfile } from "@/schemas";

type SerializedAuthorProfile = Omit<AuthorProfile, "createdAt"> & {
  createdAt: string | Date;
};

interface AuthorProfileCardProps {
  author: SerializedAuthorProfile;
}

export default function AuthorProfileCard({ author }: AuthorProfileCardProps) {
  const memberSince = new Date(author.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body items-center text-center">
        <div className="avatar placeholder mb-4">
          <div className="bg-neutral text-neutral-content rounded-full w-24">
            <span className="text-3xl">{author.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <h1 className="card-title text-2xl">{author.name}</h1>
        <p className="text-base-content/70">{author.email}</p>
        <div className="divider"></div>
        <div className="stats stats-vertical sm:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Articles</div>
            <div className="stat-value text-primary">{author.articleCount}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Member since</div>
            <div className="stat-value text-sm">{memberSince}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthorProfileCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body items-center text-center">
        <div className="avatar placeholder mb-4">
          <div className="bg-base-300 rounded-full w-24 animate-pulse"></div>
        </div>
        <div className="skeleton h-8 w-48 mx-auto mb-2"></div>
        <div className="skeleton h-4 w-64 mx-auto"></div>
        <div className="divider"></div>
        <div className="stats stats-vertical sm:stats-horizontal shadow">
          <div className="stat">
            <div className="skeleton h-4 w-20 mx-auto"></div>
            <div className="skeleton h-10 w-16 mx-auto mt-2"></div>
          </div>
          <div className="stat">
            <div className="skeleton h-4 w-24 mx-auto"></div>
            <div className="skeleton h-6 w-24 mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
