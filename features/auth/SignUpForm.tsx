"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, FormAppError } from "@/components/FormField";
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

  const onSubmit = async (values: RegisterInput) => {
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
      <FormField<RegisterInput>
        name="name"
        label="Name"
        placeholder="John Doe"
        autoComplete="name"
        register={register}
        error={errors.name}
        actionErrors={actionErrors}
        rules={{ required: "Name is required" }}
      />

      <FormField<RegisterInput>
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

      <FormField<RegisterInput>
        name="password"
        label="Password"
        type="password"
        placeholder="Create a password"
        autoComplete="new-password"
        register={register}
        error={errors.password}
        actionErrors={actionErrors}
        rules={{ required: "Password is required" }}
      />

      <FormField<RegisterInput>
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        register={register}
        error={errors.confirmPassword}
        actionErrors={actionErrors}
        rules={{ required: "Please confirm your password" }}
      />

      <FormAppError actionErrors={actionErrors} />

      <p>
        Already have an account?{" "}
        <Link className="underline font-bold" href="/signin">
          Sign In.
        </Link>
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting && <span className="loading loading-spinner" />}
        Sign up
      </button>
    </form>
  );
}
