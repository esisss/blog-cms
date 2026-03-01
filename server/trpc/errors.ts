import { TRPCError } from "@trpc/server";

type ErrorDetails = Record<string, string[]>;

export function authError(message = "Authentication required") {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message,
    cause: { reason: "AUTH_REQUIRED" },
  });
}

export function permissionError(message = "You do not have access") {
  return new TRPCError({
    code: "FORBIDDEN",
    message,
    cause: { reason: "FORBIDDEN" },
  });
}

export function sessionError(message = "Unable to resolve session") {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message,
    cause: { reason: "SESSION_ERROR" },
  });
}

export function dbError(message = "Database error", details?: ErrorDetails) {
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
    cause: { reason: "DB_ERROR", details },
  });
}
