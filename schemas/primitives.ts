import { z } from "zod";

// auth related
export const idSchema = z.string().min(1, "id is required");
export const emailSchema = z.email("invalid email");
export const passwordSchema = z
  .string()
  .min(8, "password must be at least 8 characters");

// common for articles
export const nonEmptyTextSchema = z.string().trim().min(1, "required");
export const titleSchema = z.string().trim().min(3, "title is required");
export const urlSchema = z.url("invalid url");
export const timestampSchema = z
  .union([z.date(), z.iso.datetime()])
  .transform((value) => (value instanceof Date ? value : new Date(value)));

export const paginationSchema = z
  .object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(10),
  })
  .strict();

export type PaginationInput = z.infer<typeof paginationSchema>;
