import { ObjectId } from "mongodb";
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
    .query(async ({ input, ctx }) => {
      const { page, pageSize } = input;
      const skip = (page - 1) * pageSize;

      try {
        const [items, total] = await Promise.all([
          ctx.db
            .collection("articles")
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray(),
          ctx.db.collection("articles").countDocuments(),
        ]);

        return {
          items: items.map((item) => ({
            id: item._id.toString(),
            title: item.title,
            text: item.text,
            coverImageUrl: item.coverImageUrl,
            authorId: item.authorId,
            createdAt: item.createdAt,
          })),
          page,
          pageSize,
          total,
        };
      } catch (error) {
        throw new Error("Failed to fetch articles", { cause: error });
      }
    }),
  getArticlesByAuthor: publicDbProcedure
    .input(getAuthorArticlesInputSchema)
    .output(articleListSchema)
    .query(async ({ input, ctx }) => {
      const { page, pageSize, authorId } = input;
      const skip = (page - 1) * pageSize;
      const filter = { authorId };

      try {
        const [items, total] = await Promise.all([
          ctx.db
            .collection("articles")
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray(),
          ctx.db.collection("articles").countDocuments(filter),
        ]);

        return {
          items: items.map((item) => ({
            id: item._id.toString(),
            title: item.title,
            text: item.text,
            coverImageUrl: item.coverImageUrl,
            authorId: item.authorId,
            createdAt: item.createdAt,
          })),
          page,
          pageSize,
          total,
        };
      } catch (error) {
        throw new Error("Failed to fetch author articles", { cause: error });
      }
    }),
  getArticleById: publicDbProcedure
    .input(getArticleByIdInputSchema)
    .output(articleSchema)
    .query(async ({ input, ctx }) => {
      const articleId = input.id;
      try {
        const article = await ctx.db
          .collection("articles")
          .findOne({ _id: new ObjectId(articleId) });

        if (!article) {
          throw new Error("Article not found");
        }

        return {
          id: article._id.toString(),
          title: article.title,
          text: article.text,
          coverImageUrl: article.coverImageUrl,
          authorId: article.authorId,
          createdAt: article.createdAt,
        };
      } catch (error) {
        throw new Error("Failed to find article", { cause: error });
      }
    }),
  createArticle: protectedProcedure
    .input(createArticleInputSchema)
    .mutation(async ({ input, ctx }) => {
      const newArticle = {
        title: input.title,
        text: input.text,
        coverImageUrl: input.coverImageUrl,
        authorId: ctx.session.user.id,
        createdAt: new Date(),
      };
      try {
        const post = await ctx.db.collection("articles").insertOne(newArticle);
        return post;
      } catch (error) {
        throw new Error("Failed to create article", { cause: error });
      }
    }),
  updateArticle: protectedProcedure
    .input(articleUpdateInputSchema)
    .output(articleSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateFields } = input;

      try {
        const result = await ctx.db.collection("articles").findOneAndUpdate(
          {
            _id: new ObjectId(id),
            authorId: ctx.session.user.id,
          },
          { $set: updateFields },
          { returnDocument: "after" }
        );

        if (!result) {
          throw new Error("Article not found or unauthorized");
        }

        return {
          id: result._id.toString(),
          title: result.title,
          text: result.text,
          coverImageUrl: result.coverImageUrl,
          authorId: result.authorId,
          createdAt: result.createdAt,
        };
      } catch (error) {
        throw new Error("Failed to update article", { cause: error });
      }
    }),

  deleteArticle: protectedProcedure
    .input(getArticleByIdInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.db.collection("articles").deleteOne({
          _id: new ObjectId(input.id),
          authorId: ctx.session.user.id,
        });

        if (result.deletedCount === 0) {
          throw new Error("Article not found or unauthorized");
        }

        return { success: true };
      } catch (error) {
        throw new Error("Failed to delete article", { cause: error });
      }
    }),
});
