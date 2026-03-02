"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchPreview } from "@/schemas";
import { searchPreviewAction } from "@/server/actions/search";
import { SearchDropdown, SearchDropdownSkeleton } from "./SearchDropdown";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<SearchPreview | null>(null);
  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch preview using server action when query changes
  useEffect(() => {
    if (debouncedQuery.length < 1) return;

    startTransition(async () => {
      const result = await searchPreviewAction(debouncedQuery);
      setPreview(result);
      setIsOpen(true);
    });
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    setPreview(null);
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}&type=all`);
      }
    },
    [query, router],
  );

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="form-control w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Search articles, authors..."
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (value.length < 1) {
                setPreview(null);
                setIsOpen(false);
              }
            }}
            onFocus={() => query.length >= 1 && preview && setIsOpen(true)}
            className="input input-bordered w-full pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown with preview results */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-base-100 rounded-lg shadow-xl border border-base-300 max-h-96 overflow-y-auto"
          onClick={handleResultClick}
        >
          {isPending ? (
            <SearchDropdownSkeleton />
          ) : preview ? (
            <SearchDropdown preview={preview} query={debouncedQuery} />
          ) : null}
        </div>
      )}
    </div>
  );
}
