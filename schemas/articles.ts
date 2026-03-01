import { z } from "zod";
import {
  idSchema,
  nonEmptyTextSchema,
  paginationSchema,
  titleSchema,
  urlSchema,
} from "./primitives";

export const createArticleInputSchema = z
  .object({
    title: titleSchema,
    text: nonEmptyTextSchema,
    coverImageUrl: urlSchema,
  })
  .strict();

export const articleUpdateInputSchema = z
  .object({
    id: idSchema,
    title: titleSchema.optional(),
    text: nonEmptyTextSchema.optional(),
    coverImageUrl: urlSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.title && !data.text && !data.coverImageUrl) {
      ctx.addIssue({
        code: "custom",
        message: "At least one field must be provided for update",
      });
    }
  });

export const articleSchema = z
  .object({
    id: idSchema,
    title: titleSchema,
    text: nonEmptyTextSchema,
    coverImageUrl: urlSchema,
  })
  .strict();

export const articleListSchema = z.object({
  items: z.array(articleSchema),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
});

export const getArticlesInputSchema = paginationSchema;

export const getAuthorArticlesInputSchema = paginationSchema.extend({
  authorId: idSchema,
});

export const getArticleByIdInputSchema = z.object({
  id: idSchema,
});
