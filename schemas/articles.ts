import { z } from "zod";
import { idSchema, nonEmptyTextSchema, titleSchema, urlSchema } from "./primitives";

export const createArticleInputSchema = z
  .object({
    title: titleSchema,
    text: nonEmptyTextSchema,
    coverUrl: urlSchema,
  })
  .strict();

export const articleUpdateInputSchema = z
  .object({
    id: idSchema,
    title: titleSchema.optional(),
    text: nonEmptyTextSchema.optional(),
    coverUrl: urlSchema.optional(),
  })
  .strict()
  .refine((value) => value.title || value.text || value.coverUrl, {
    message: "at least one field must be provided",
    path: ["title"],
  });
