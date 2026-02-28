"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ActionErrors, ActionResponse, LoginInput } from "@/types";

type SignInFormProps = {
  onSubmitAction?: (values: LoginInput) => Promise<ActionResponse<unknown>>;
};

export function SignInForm({ onSubmitAction }: SignInFormProps) {
  const [actionErrors, setActionErrors] = useState<ActionErrors | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const submit = await onSubmitAction?.(values);

        if (submit && !submit.success) {
          setActionErrors(
            submit.errors ?? {
              type: "app",
              message: submit.message ?? "An error occurred",
            },
          );
          return;
        }

        setActionErrors(null);
      })}
      noValidate
    >
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email ? <p role="alert">{errors.email.message}</p> : null}
        {actionErrors?.type === "zod" &&
        actionErrors.data.fieldErrors.email?.length
          ? actionErrors.data.fieldErrors.email.map((message) => (
              <p key={message} role="alert">
                {message}
              </p>
            ))
          : null}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password ? <p role="alert">{errors.password.message}</p> : null}
        {actionErrors?.type === "zod" &&
        actionErrors.data.fieldErrors.password?.length
          ? actionErrors.data.fieldErrors.password.map((message) => (
              <p key={message} role="alert">
                {message}
              </p>
            ))
          : null}
      </div>

      {actionErrors ? (
        <div role="alert">
          {actionErrors.type === "app" ? (
            <p>{actionErrors.message}</p>
          ) : actionErrors.data.formErrors.length ? (
            actionErrors.data.formErrors.map((message) => (
              <p key={message}>{message}</p>
            ))
          ) : null}
        </div>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        Sign in
      </button>
    </form>
  );
}
