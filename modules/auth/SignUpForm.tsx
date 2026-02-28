"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ActionErrors, ActionResponse, RegisterInput } from "@/types";

type SignUpFormProps = {
  onSubmitAction?: (values: RegisterInput) => Promise<ActionResponse<unknown>>;
};

export function SignUpForm({ onSubmitAction }: SignUpFormProps) {
  const [actionErrors, setActionErrors] = useState<ActionErrors | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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
        <label htmlFor="name" className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          className="input input-bordered w-full"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {errors.name.message}
            </span>
          </div>
        ) : actionErrors?.type === "zod" &&
          actionErrors.data.fieldErrors.name?.length ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {actionErrors.data.fieldErrors.name[0]}
            </span>
          </div>
        ) : null}
      </div>

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
          <span className="label-text ">Password</span>
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
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

      <div className="form-control flex flex-col">
        <label htmlFor="confirmPassword" className="label">
          <span className="label-text">Confirm Password</span>
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          className="input input-bordered w-full"
          {...register("confirmPassword", {
            required: "Please confirm your password",
          })}
        />
        {errors.confirmPassword ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {errors.confirmPassword.message}
            </span>
          </div>
        ) : actionErrors?.type === "zod" &&
          actionErrors.data.fieldErrors.confirmPassword?.length ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {actionErrors.data.fieldErrors.confirmPassword[0]}
            </span>
          </div>
        ) : null}
      </div>

      {actionErrors?.type === "app" ? (
        <div role="alert" className="alert alert-error">
          <span>{actionErrors.message}</span>
        </div>
      ) : null}
      <p></p>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : null}
        Sign up
      </button>
    </form>
  );
}
