import { createTRPCContext } from "./context";
import { articlesRouter } from "./routers/articles";
import { authorsRouter } from "./routers/authors";
import { searchRouter } from "./routers/search";
import { createCallerFactory, router } from "./trpc";

export const appRouter = router({
  articles: articlesRouter,
  authors: authorsRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;

// Server-side caller for use in Server Components
const createCaller = createCallerFactory(appRouter);

export async function getServerCaller() {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
}
