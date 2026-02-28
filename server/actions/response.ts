import type { ZodError, ZodFormattedError } from "zod";
import type { ActionErrors, ActionResponse } from "../../types";

export function ok<T>(data?: T, message?: string): ActionResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function fail(
  message: string = "An error occurred while processing your request.",
  errors?: ActionErrors,
): ActionResponse {
  console.error(message);
  return {
    success: false,
    message,
    errors,
  };
}

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

export function fromAppError(
  message: string,
  code?: string,
  details?: Record<string, string[]>,
): ActionErrors {
  return { type: "app", code, message, details };
}
