import Link from "next/link";
import { AuthorResultsFeed } from "@/features/search/AuthorResultsFeed";
import { SearchResultsFeed } from "@/features/search/SearchResultsFeed";
import { getServerCaller } from "@/server/trpc";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    page?: string;
  }>;
}

const typeLabels: Record<string, string> = {
  all: "All Results",
  title: "Title Matches",
  content: "Coincidencias de contenido",
  author: "Por Nombre de Autor",
  authors: "Autores",
};

const tabTypes = ["all", "title", "content", "author", "authors"] as const;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const type = (params.type ?? "all") as (typeof tabTypes)[number];
  const page = parseInt(params.page ?? "1", 10);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          <p className="text-base-content/60">
            Escribe algo en la barra de búsqueda para encontrar artículos o
            autores.
          </p>
        </div>
      </div>
    );
  }

  const caller = await getServerCaller();

  // For "authors" type, we call the authorsResults procedure
  // For other types, we call the articles results procedure
  const isAuthorsTab = type === "authors";

  const [articlesResults, authorsResults] = await Promise.all([
    isAuthorsTab
      ? null
      : caller.search.results({
          query,
          type: type as "all" | "title" | "content" | "author",
          page,
          pageSize: 10,
        }),
    isAuthorsTab
      ? caller.search.authorsResults({
          query,
          page,
          pageSize: 12,
        })
      : null,
  ]);

  const total = isAuthorsTab ? authorsResults!.total : articlesResults!.total;
  const pageSize = isAuthorsTab ? 12 : 10;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Search: &ldquo;{query}&rdquo;
        </h1>
        <p className="text-base-content/60">
          {total} {total === 1 ? "result" : "results"} found
        </p>
      </div>

      {/* Filter tabs */}
      <div className="tabs tabs-boxed mb-6 w-fit">
        {tabTypes.map((t) => (
          <Link
            key={t}
            href={`/search?q=${encodeURIComponent(query)}&type=${t}`}
            className={`tab ${type === t ? "tab-active" : ""}`}
          >
            {typeLabels[t]}
          </Link>
        ))}
      </div>

      {isAuthorsTab ? (
        <AuthorResultsFeed
          authors={authorsResults!.authors}
          currentPage={page}
          totalPages={totalPages}
          query={query}
        />
      ) : (
        <SearchResultsFeed
          articles={articlesResults!.articles}
          currentPage={page}
          totalPages={totalPages}
          query={query}
          type={type}
        />
      )}
    </div>
  );
}
