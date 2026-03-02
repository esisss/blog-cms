"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, FormAppError } from "@/components/FormField";
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

  const onSubmit = async (values: LoginInput) => {
    const submit = await onSubmitAction?.(values);

    if (submit && !submit.success) {
      setActionErrors(
        submit.errors ?? {
          type: "app",
          message: submit.message ?? "An error occurred",
        }
      );
      return;
    }

    setActionErrors(null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full space-y-4"
    >
      <FormField<LoginInput>
        name="email"
        label="Email"
        type="email"
        placeholder="email@example.com"
        autoComplete="email"
        register={register}
        error={errors.email}
        actionErrors={actionErrors}
        rules={{ required: "Email is required" }}
      />

      <FormField<LoginInput>
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        register={register}
        error={errors.password}
        actionErrors={actionErrors}
        rules={{ required: "Password is required" }}
      />

      <FormAppError actionErrors={actionErrors} />

      <p>
        Dont have an account?{" "}
        <Link className="underline font-bold" href="/signup">
          Register
        </Link>
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting && <span className="loading loading-spinner" />}
        Sign in
      </button>
    </form>
  );
}
