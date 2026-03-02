import { z } from "zod";
import { articleSchema } from "./articles";
import { authorWithCountSchema } from "./auth";

export const searchInputSchema = z.object({
  query: z.string().min(1).max(100),
});

export const searchPreviewSchema = z.object({
  authors: z.array(authorWithCountSchema),
  articlesByTitle: z.array(articleSchema),
  articlesByContent: z.array(articleSchema),
  counts: z.object({
    authors: z.number().int().min(0),
    byTitle: z.number().int().min(0),
    byContent: z.number().int().min(0),
  }),
});

export const searchResultsSchema = z.object({
  articles: z.array(articleSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export const searchResultsInputSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(["all", "title", "content", "author"]),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const authorsSearchInputSchema = z.object({
  query: z.string().min(1).max(100),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const authorsSearchResultsSchema = z.object({
  authors: z.array(authorWithCountSchema),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
export type SearchPreview = z.infer<typeof searchPreviewSchema>;
export type SearchResults = z.infer<typeof searchResultsSchema>;
export type SearchResultsInput = z.infer<typeof searchResultsInputSchema>;
export type AuthorsSearchInput = z.infer<typeof authorsSearchInputSchema>;
export type AuthorsSearchResults = z.infer<typeof authorsSearchResultsSchema>;
