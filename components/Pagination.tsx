"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationBaseProps {
  currentPage: number;
  totalPages: number;
}

interface CallbackPaginationProps extends PaginationBaseProps {
  /** Callback mode - for client-side state management */
  onPageChange: (page: number) => void;
  buildUrl?: never;
}

interface UrlPaginationProps extends PaginationBaseProps {
  /** URL mode - for server-side navigation with Links */
  buildUrl: (page: number) => string;
  onPageChange?: never;
}

type PaginationProps = CallbackPaginationProps | UrlPaginationProps;

/**
 * Pagination component that supports two modes:
 * 1. Callback mode: uses onPageChange for client-side state
 * 2. URL mode: uses buildUrl to generate Links for server-side navigation
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  buildUrl,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const isUrlMode = !!buildUrl;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Render a page button/link
  const renderPageElement = (page: number) => {
    const isActive = currentPage === page;
    const className = `join-item btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`;

    if (isUrlMode) {
      return (
        <Link key={page} href={buildUrl(page)} className={className}>
          {page}
        </Link>
      );
    }

    return (
      <button
        type="button"
        key={page}
        onClick={() => onPageChange?.(page)}
        className={className}
      >
        {page}
      </button>
    );
  };

  // Render prev/next navigation
  const renderNavButton = (direction: "prev" | "next") => {
    const isPrev = direction === "prev";
    const disabled = isPrev ? !canGoPrevious : !canGoNext;
    const targetPage = isPrev ? currentPage - 1 : currentPage + 1;
    const Icon = isPrev ? ChevronLeft : ChevronRight;
    const label = isPrev ? "Previous page" : "Next page";

    const className = `btn btn-sm btn-ghost ${disabled ? "btn-disabled" : ""}`;

    if (isUrlMode && !disabled) {
      return (
        <Link href={buildUrl(targetPage)} className={className} aria-label={label}>
          <Icon className="w-4 h-4" />
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => !disabled && onPageChange?.(targetPage)}
        disabled={disabled}
        className={className}
        aria-label={label}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {renderNavButton("prev")}

      <div className="join">
        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="join-item btn btn-sm btn-disabled"
            >
              ...
            </span>
          ) : (
            renderPageElement(page)
          )
        )}
      </div>

      {renderNavButton("next")}

      <span className="text-sm text-base-content/60 ml-2">
        Pagina {currentPage} de {totalPages}
      </span>
    </div>
  );
}
