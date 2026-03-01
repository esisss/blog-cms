import { z } from "zod";

// auth related
export const idSchema = z.string().min(1, "Id is required");
export const emailSchema = z.email("Invalid email");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must have uppercase")
  .regex(/[a-z]/, "Must have lowercase")
  .regex(/[0-9]/, "Must have number")
  .regex(/[^A-Za-z0-9]/, "Must have special character");

// common for articles
export const nonEmptyTextSchema = z.string().trim().min(1, "Required");
export const titleSchema = z
  .string()
  .trim()
  .min(3, "Title is required")
  .max(100, "Title must be less than 100 characters");
export const urlSchema = z.url("Invalid URL");
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
