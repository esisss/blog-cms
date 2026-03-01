import {
  articleListSchema,
  articleSchema,
  articleUpdateInputSchema,
  createArticleInputSchema,
  getArticleByIdInputSchema,
  getArticlesInputSchema,
  getAuthorArticlesInputSchema,
} from "@/schemas";
import { protectedProcedure, publicDbProcedure, router } from "../trpc";

export const articlesRouter = router({
  getArticles: publicDbProcedure
    .input(getArticlesInputSchema)
    .output(articleListSchema)
    .query(({ input }) => ({
      items: [],
      page: input.page,
      pageSize: input.pageSize,
      total: 0,
    })),
  getArticlesByAuthor: publicDbProcedure
    .input(getAuthorArticlesInputSchema)
    .output(articleListSchema)
    .query(({ input }) => ({
      items: [],
      page: input.page,
      pageSize: input.pageSize,
      total: 0,
    })),
  getArticleById: publicDbProcedure
    .input(getArticleByIdInputSchema)
    .output(articleSchema)
    .query(() => ({
      id: "",
      title: "",
      text: "",
      coverImageUrl: "",
    })),
  createArticle: protectedProcedure
    .input(createArticleInputSchema)
    .mutation(async ({ input }) => {
      const newArticle = {
        title: input.title,
        text: input.text,
        coverImageUrl: input.coverImageUrl,
      };
      console.log(newArticle);
      return newArticle;
    }),
  updateArticle: protectedProcedure
    .input(articleUpdateInputSchema)
    .output(articleSchema)
    .mutation(() => ({
      id: "",
      title: "",
      text: "",
      coverImageUrl: "",
    })),
});
