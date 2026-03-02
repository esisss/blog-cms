"use client";

import AuthorsList, { AuthorsListSkeleton } from "@/components/AuthorsList";
import { useAuthors } from "@/hooks/useAuthorQueries";

export default function AuthorsListContainer() {
  const { data, isLoading, error } = useAuthors();

  if (isLoading) {
    return <AuthorsListSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-3xl mb-8">Autores</h3>
        <div className="card bg-base-100 shadow-md p-4">
          <p className="text-error text-sm">
            No se pudieron cargar los autores
          </p>
        </div>
      </div>
    );
  }

  return <AuthorsList authors={data ?? []} />;
}
