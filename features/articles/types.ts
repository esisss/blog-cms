import type { z } from "zod";
import type {
  createArticleInputSchema,
  articleUpdateInputSchema,
} from "@/schemas/articles";

export type CreateArticleInput = z.infer<typeof createArticleInputSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateInputSchema>;
