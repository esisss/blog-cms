import { initTRPC, TRPCError } from "@trpc/server";
import type { TRPCContext } from "./context";
import { sessionError } from "./errors";

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    const cause = error.cause as
      | { code?: string; reason?: string; details?: Record<string, string[]> }
      | undefined;

    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
        reason: cause?.reason,
        details: cause?.details,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const publicDbProcedure = t.procedure.use(({ ctx, next }) => {
  if (ctx.contextError || !ctx.db) {
    throw sessionError();
  }

  return next({ ctx: { db: ctx.db, session: ctx.session } });
});
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (ctx.contextError || !ctx.db) {
    throw sessionError();
  }
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required.",
      cause: { reason: "AUTH_REQUIRED" },
    });
  }

  return next({ ctx: { session: ctx.session, db: ctx.db } });
});
