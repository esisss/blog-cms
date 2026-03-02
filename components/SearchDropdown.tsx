import { FileText, Type, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { SearchPreview } from "@/schemas";

interface SearchDropdownProps {
  preview: SearchPreview;
  query: string;
}

export function SearchDropdown({ preview, query }: SearchDropdownProps) {
  const { authors, articlesByTitle, articlesByContent, counts } = preview;
  const hasResults =
    counts.authors > 0 || counts.byTitle > 0 || counts.byContent > 0;

  if (!hasResults) {
    return (
      <div className="p-4 text-center text-base-content/60">
        No results found for &ldquo;{query}&rdquo;
      </div>
    );
  }

  return (
    <div className="divide-y divide-base-300">
      {/* Authors Section */}
      {counts.authors > 0 && (
        <div className="p-3">
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=author`}
            className="flex items-center justify-between text-sm font-medium text-base-content/70 hover:text-primary mb-2"
          >
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Autores
            </span>
            <span className="badge badge-sm badge-ghost">{counts.authors}</span>
          </Link>
          <ul className="space-y-1">
            {authors.map((author) => (
              <li key={author.id}>
                <Link
                  href={`/profile/${author.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <Image
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          author.name,
                        )}&background=random&size=128`}
                        alt={author.name}
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{author.name}</p>
                    <p className="text-xs text-base-content/60">
                      {author.articleCount}{" "}
                      {author.articleCount === 1 ? "article" : "articles"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Articles by Title Section */}
      {counts.byTitle > 0 && (
        <div className="p-3">
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=title`}
            className="flex items-center justify-between text-sm font-medium text-base-content/70 hover:text-primary mb-2"
          >
            <span className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Matches in Title
            </span>
            <span className="badge badge-sm badge-ghost">{counts.byTitle}</span>
          </Link>
          <ul className="space-y-1">
            {articlesByTitle.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/article/${article.id}`}
                  className="block p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <p className="font-medium truncate">{article.title}</p>
                  <p className="text-xs text-base-content/60 line-clamp-1">
                    {article.text}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Articles by Content Section */}
      {counts.byContent > 0 && (
        <div className="p-3">
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=content`}
            className="flex items-center justify-between text-sm font-medium text-base-content/70 hover:text-primary mb-2"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Matches in Content
            </span>
            <span className="badge badge-sm badge-ghost">
              {counts.byContent}
            </span>
          </Link>
          <ul className="space-y-1">
            {articlesByContent.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/article/${article.id}`}
                  className="block p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <p className="font-medium truncate">{article.title}</p>
                  <p className="text-xs text-base-content/60 line-clamp-1">
                    {article.text}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* View all results link */}
      <div className="p-3">
        <Link
          href={`/search?q=${encodeURIComponent(query)}&type=all`}
          className="btn btn-primary btn-sm w-full"
        >
          View all results
        </Link>
      </div>
    </div>
  );
}

export function SearchDropdownSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="skeleton w-4 h-4 rounded"></div>
        <div className="skeleton h-4 w-20"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <div className="skeleton w-8 h-8 rounded-full"></div>
          <div className="flex-1 space-y-1">
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-3 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
