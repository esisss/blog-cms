import type { ActionErrors, ActionResponse } from "@/types";

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
