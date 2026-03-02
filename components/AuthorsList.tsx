import Link from "next/link";

interface Author {
  id: string;
  name: string;
  email: string;
  articleCount: number;
}

interface AuthorsListProps {
  authors: Author[];
}

export function AuthorsListSkeleton() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl mb-8">Authors</h1>
      <div className="card bg-base-100 shadow-md p-6">
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="skeleton w-10 h-10 rounded-full"></div>
                <div className="skeleton h-4 w-24"></div>
              </div>
              <div className="skeleton h-4 w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthorsList({ authors }: AuthorsListProps) {
  if (authors.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-3xl mb-8">Authors</h3>
        <div className="card bg-base-100 shadow-md p-4">
          <p className="text-base-content/50 text-sm">No authors yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl mb-8">Authors</h3>
      <div className="card bg-base-100 shadow-md p-4">
        <ul className="space-y-3">
          {authors.map((author) => (
            <li key={author.id}>
              <Link
                href={`/profile/${author.id}`}
                className="flex items-center justify-between hover:bg-base-200 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span className="text-sm">
                        {author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium">{author.name}</span>
                </div>
                <div className="badge badge-ghost">
                  {author.articleCount}{" "}
                  {author.articleCount === 1 ? "article" : "articles"}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
