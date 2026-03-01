import { articlesRouter } from "./routers/articles";
import { authorsRouter } from "./routers/authors";
import { router } from "./trpc";

export const appRouter = router({
  articles: articlesRouter,
  authors: authorsRouter,
});

export type AppRouter = typeof appRouter;
