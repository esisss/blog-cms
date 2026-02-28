"use client";

import Link from "next/link";
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
      className="w-full space-y-4"
    >
      <div className="form-control flex flex-col">
        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="email@example.com"
          className="input input-bordered w-full"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {errors.email.message}
            </span>
          </div>
        ) : actionErrors?.type === "zod" &&
          actionErrors.data.fieldErrors.email?.length ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {actionErrors.data.fieldErrors.email[0]}
            </span>
          </div>
        ) : null}
      </div>

      <div className="form-control flex flex-col">
        <label htmlFor="password" className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="input input-bordered w-full"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {errors.password.message}
            </span>
          </div>
        ) : actionErrors?.type === "zod" &&
          actionErrors.data.fieldErrors.password?.length ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {actionErrors.data.fieldErrors.password[0]}
            </span>
          </div>
        ) : null}
      </div>

      {actionErrors?.type === "app" ? (
        <div role="alert" className="alert alert-error">
          <span>{actionErrors.message}</span>
        </div>
      ) : null}
      <p>
        Dont have an account?{" "}
        <Link className="underline font-bold " href="/signup">
          Register
        </Link>
      </p>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : null}
        Sign in
      </button>
    </form>
  );
}
