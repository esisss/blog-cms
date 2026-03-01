import type { ZodError, ZodFormattedError } from "zod";
import type { ActionErrors } from "@/types";

// === tRPC Error Parsing (client-side) ===

type TrpcErrorShape = {
  data?: {
    code?: string;
    reason?: string;
    details?: Record<string, string[]>;
    zodError?:
      | {
          formErrors?: string[];
          fieldErrors?: Record<string, string[]>;
        }
      | Array<{
          path?: Array<string | number>;
          message?: string;
        }>;
  };
  message?: string;
};

type ZodIssue = {
  path?: Array<string | number>;
  message?: string;
};

function mapIssuesToZod(issues: ZodIssue[]): ActionErrors {
  const fieldErrors: Record<string, string[]> = {};
  const formErrors: string[] = [];

  issues.forEach((issue) => {
    const path = issue.path?.[0];
    if (typeof path === "string") {
      fieldErrors[path] = fieldErrors[path] ?? [];
      if (issue.message) fieldErrors[path].push(issue.message);
    } else if (issue.message) {
      formErrors.push(issue.message);
    }
  });

  return {
    type: "zod",
    data: {
      formErrors,
      fieldErrors,
    },
  };
}

export function fromTrpcError(error: unknown): ActionErrors | null {
  const trpcError = error as TrpcErrorShape | undefined;

  if (trpcError?.data?.zodError) {
    if (Array.isArray(trpcError.data.zodError)) {
      return mapIssuesToZod(trpcError.data.zodError);
    }

    return {
      type: "zod",
      data: {
        formErrors: trpcError.data.zodError.formErrors ?? [],
        fieldErrors: trpcError.data.zodError.fieldErrors ?? {},
      },
    };
  }

  if (!trpcError?.data?.reason && !trpcError?.message) {
    return null;
  }

  if (typeof trpcError?.message === "string") {
    const trimmed = trpcError.message.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return mapIssuesToZod(parsed as ZodIssue[]);
        }
      } catch {
        // ignore JSON parse errors
      }
    }
  }

  return {
    type: "app",
    code: trpcError.data?.reason,
    message: trpcError.message ?? "An error occurred",
    details: trpcError.data?.details,
  };
}

// === Zod Error Conversion ===

export function fromZodError(error: ZodError): ActionErrors {
  const formatted: ZodFormattedError<unknown> = error.format();
  const formErrors: string[] = formatted._errors ?? [];
  const fieldErrors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(formatted)) {
    if (key === "_errors") continue;
    const err = value as ZodFormattedError<unknown>;
    fieldErrors[key] = err._errors ?? [];
  }

  return { type: "zod", data: { formErrors, fieldErrors } };
}

// === App Error Creation ===

export function fromAppError(
  message: string,
  code?: string,
  details?: Record<string, string[]>,
): ActionErrors {
  return { type: "app", code, message, details };
}
