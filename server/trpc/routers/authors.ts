import { ObjectId } from "mongodb";
import {
  authorProfileSchema,
  getAuthorByIdInputSchema,
  getAuthorsSchema,
} from "@/schemas/auth";
import { publicDbProcedure, router } from "../trpc";

export const authorsRouter = router({
  getAuthors: publicDbProcedure
    .output(getAuthorsSchema)
    .query(async ({ ctx }) => {
      try {
        const authors = await ctx.db
          .collection("user")
          .aggregate([
            {
              $addFields: {
                idString: { $toString: "$_id" },
              },
            },
            {
              $lookup: {
                from: "articles",
                localField: "idString",
                foreignField: "authorId",
                as: "articles",
              },
            },
            {
              $project: {
                id: { $toString: "$_id" },
                name: 1,
                email: 1,
                articleCount: { $size: "$articles" },
              },
            },
          ])
          .toArray();

        return authors.map((author) => ({
          id: author.id,
          name: author.name,
          email: author.email,
          articleCount: author.articleCount,
        }));
      } catch (error) {
        throw new Error("Failed to fetch authors", { cause: error });
      }
    }),

  getAuthorById: publicDbProcedure
    .input(getAuthorByIdInputSchema)
    .output(authorProfileSchema)
    .query(async ({ input, ctx }) => {
      try {
        const authors = await ctx.db
          .collection("user")
          .aggregate([
            {
              $match: { _id: new ObjectId(input.id) },
            },
            {
              $addFields: {
                idString: { $toString: "$_id" },
              },
            },
            {
              $lookup: {
                from: "articles",
                localField: "idString",
                foreignField: "authorId",
                as: "articles",
              },
            },
            {
              $project: {
                id: { $toString: "$_id" },
                name: 1,
                email: 1,
                createdAt: 1,
                articleCount: { $size: "$articles" },
              },
            },
          ])
          .toArray();

        const author = authors[0];

        if (!author) {
          throw new Error("Author not found");
        }

        return {
          id: author.id,
          name: author.name,
          email: author.email,
          createdAt: author.createdAt,
          articleCount: author.articleCount,
        };
      } catch (error) {
        throw new Error("Failed to fetch author", { cause: error });
      }
    }),
});
