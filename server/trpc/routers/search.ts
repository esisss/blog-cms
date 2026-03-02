import {
  searchInputSchema,
  searchPreviewSchema,
  searchResultsInputSchema,
  searchResultsSchema,
  authorsSearchInputSchema,
  authorsSearchResultsSchema,
} from "@/schemas";
import { publicDbProcedure, router } from "../trpc";

export const searchRouter = router({
  // Preview search - returns grouped counts and limited results for dropdown
  preview: publicDbProcedure
    .input(searchInputSchema)
    .output(searchPreviewSchema)
    .query(async ({ input, ctx }) => {
      const { query } = input;
      const searchRegex = { $regex: query, $options: "i" };

      try {
        // Search authors by name
        const authorsAggregation = await ctx.db
          .collection("user")
          .aggregate([
            { $match: { name: searchRegex } },
            {
              $lookup: {
                from: "articles",
                let: { odId: { $toString: "$_id" } },
                pipeline: [
                  { $match: { $expr: { $eq: ["$authorId", "$$odId"] } } },
                  { $count: "count" },
                ],
                as: "articles",
              },
            },
            {
              $project: {
                id: { $toString: "$_id" },
                name: 1,
                email: 1,
                articleCount: {
                  $ifNull: [{ $arrayElemAt: ["$articles.count", 0] }, 0],
                },
              },
            },
            { $limit: 5 },
          ])
          .toArray();

        // Count total matching authors
        const authorsCount = await ctx.db
          .collection("user")
          .countDocuments({ name: searchRegex });

        // Search articles by title
        const articlesByTitle = await ctx.db
          .collection("articles")
          .find({ title: searchRegex })
          .sort({ createdAt: -1 })
          .limit(3)
          .toArray();

        const titleCount = await ctx.db
          .collection("articles")
          .countDocuments({ title: searchRegex });

        // Search articles by content (text field)
        const articlesByContent = await ctx.db
          .collection("articles")
          .find({
            text: searchRegex,
            // Exclude articles already found by title
            _id: { $nin: articlesByTitle.map((a) => a._id) },
          })
          .sort({ createdAt: -1 })
          .limit(3)
          .toArray();

        const contentCount = await ctx.db
          .collection("articles")
          .countDocuments({ text: searchRegex });

        return {
          authors: authorsAggregation.map((a) => ({
            id: a.id,
            name: a.name,
            email: a.email,
            articleCount: a.articleCount,
          })),
          articlesByTitle: articlesByTitle.map((a) => ({
            id: a._id.toString(),
            title: a.title,
            text: a.text,
            coverImageUrl: a.coverImageUrl,
            authorId: a.authorId,
            createdAt: a.createdAt,
          })),
          articlesByContent: articlesByContent.map((a) => ({
            id: a._id.toString(),
            title: a.title,
            text: a.text,
            coverImageUrl: a.coverImageUrl,
            authorId: a.authorId,
            createdAt: a.createdAt,
          })),
          counts: {
            authors: authorsCount,
            byTitle: titleCount,
            byContent: contentCount,
          },
        };
      } catch (error) {
        throw new Error("Failed to search", { cause: error });
      }
    }),

  // Full search results with pagination
  results: publicDbProcedure
    .input(searchResultsInputSchema)
    .output(searchResultsSchema)
    .query(async ({ input, ctx }) => {
      const { query, type, page, pageSize } = input;
      const skip = (page - 1) * pageSize;
      const searchRegex = { $regex: query, $options: "i" };

      try {
        let filter: Record<string, unknown> = {};

        if (type === "title") {
          filter = { title: searchRegex };
        } else if (type === "content") {
          filter = { text: searchRegex };
        } else if (type === "author") {
          // First find matching author IDs
          const matchingAuthors = await ctx.db
            .collection("user")
            .find({ name: searchRegex })
            .project({ _id: 1 })
            .toArray();

          const authorIds = matchingAuthors.map((a) => a._id.toString());
          filter = { authorId: { $in: authorIds } };
        } else {
          // "all" - search in title OR text
          filter = {
            $or: [{ title: searchRegex }, { text: searchRegex }],
          };
        }

        const [articles, total] = await Promise.all([
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
          articles: articles.map((a) => ({
            id: a._id.toString(),
            title: a.title,
            text: a.text,
            coverImageUrl: a.coverImageUrl,
            authorId: a.authorId,
            createdAt: a.createdAt,
          })),
          total,
          page,
          pageSize,
        };
      } catch (error) {
        throw new Error("Failed to search articles", { cause: error });
      }
    }),

  // Search authors by name with pagination
  authorsResults: publicDbProcedure
    .input(authorsSearchInputSchema)
    .output(authorsSearchResultsSchema)
    .query(async ({ input, ctx }) => {
      const { query, page, pageSize } = input;
      const skip = (page - 1) * pageSize;
      const searchRegex = { $regex: query, $options: "i" };

      try {
        const [authorsAggregation, total] = await Promise.all([
          ctx.db
            .collection("user")
            .aggregate([
              { $match: { name: searchRegex } },
              {
                $lookup: {
                  from: "articles",
                  let: { odId: { $toString: "$_id" } },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$authorId", "$$odId"] } } },
                    { $count: "count" },
                  ],
                  as: "articles",
                },
              },
              {
                $project: {
                  id: { $toString: "$_id" },
                  name: 1,
                  email: 1,
                  articleCount: {
                    $ifNull: [{ $arrayElemAt: ["$articles.count", 0] }, 0],
                  },
                },
              },
              { $skip: skip },
              { $limit: pageSize },
            ])
            .toArray(),
          ctx.db.collection("user").countDocuments({ name: searchRegex }),
        ]);

        return {
          authors: authorsAggregation.map((a) => ({
            id: a.id,
            name: a.name,
            email: a.email,
            articleCount: a.articleCount,
          })),
          total,
          page,
          pageSize,
        };
      } catch (error) {
        throw new Error("Failed to search authors", { cause: error });
      }
    }),
});
