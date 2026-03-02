"use client";

import Image from "next/image";
import { useState } from "react";
import type { AuthorProfile } from "@/schemas";

const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/1128826884/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment.jpg?s=612x612&w=0&k=20&c=390e76zN_TJ7HZHJpnI7jNl7UBpO3UP7hpR2meE1Qd4=";

type SerializedAuthorProfile = Omit<AuthorProfile, "createdAt"> & {
  createdAt: string | Date;
};

interface AuthorProfileCardProps {
  author: SerializedAuthorProfile;
}

export default function AuthorProfileCard({ author }: AuthorProfileCardProps) {
  const [imgError, setImgError] = useState(false);

  const memberSince = new Date(author.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    author.name,
  )}&background=random&size=128`;

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body items-center text-center">
        <div className="avatar mb-4">
          <div className="w-24 rounded-full">
            <Image
              src={imgError ? FALLBACK_IMAGE : avatarUrl}
              alt={author.name}
              width={96}
              height={96}
              onError={() => setImgError(true)}
            />
          </div>
        </div>
        <h1 className="card-title text-2xl">{author.name}</h1>
        {/*<p className="text-base-content/70">{author.email}</p>*/}
        <div className="divider"></div>
        <div className="stats stats-vertical sm:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Artículos</div>
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
