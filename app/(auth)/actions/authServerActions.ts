"use server";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginInputSchema, registerInputSchema } from "@/schemas";
import { fail, fromAppError, fromZodError } from "@/server/actions/response";
import { auth } from "@/server/auth/auth";
import type { ActionResponse, LoginInput, RegisterInput } from "@/types";

export const signUpAction = async (
  data: RegisterInput,
): Promise<ActionResponse<unknown>> => {
  const parseResults = await registerInputSchema.safeParseAsync(data);
  if (!parseResults.success) {
    return fail("Validation failed", fromZodError(parseResults.error));
  }
  try {
    await auth.api.signUpEmail({
      body: {
        name: parseResults.data.name,
        email: parseResults.data.email,
        password: parseResults.data.password,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return fail("Failed to sign up", fromAppError(error.message));
    } else if (error instanceof APIError) {
      return fail("Failed to sign up", fromAppError(error.message));
    } else {
      return fail(
        "Failed to sign up",
        fromAppError("An unexpected error occurred during sign up."),
      );
    }
  }

  redirect("/");
};

export const signInAction = async (
  data: LoginInput,
): Promise<ActionResponse<unknown>> => {
  const parseResults = await loginInputSchema.safeParseAsync(data);
  if (!parseResults.success) {
    return fail("Validation failed", fromZodError(parseResults.error));
  }
  try {
    await auth.api.signInEmail({
      body: {
        email: parseResults.data.email,
        password: parseResults.data.password,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return fail("Failed to sign up", fromAppError(error.message));
    } else if (error instanceof APIError) {
      return fail("Failed to sign up", fromAppError(error.message));
    } else {
      return fail(
        "Failed to sign in",
        fromAppError("An unexpected error occurred during sign in."),
      );
    }
  }

  redirect("/");
};

export const signOutAction = async (): Promise<ActionResponse<unknown>> => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof Error) {
      return fail("Failed to sign out", fromAppError(error.message));
    } else if (error instanceof APIError) {
      return fail("Failed to sign out", fromAppError(error.message));
    } else {
      return fail(
        "Failed to sign out",
        fromAppError("An unexpected error occurred during sign out."),
      );
    }
  }

  redirect("/signin");
};
