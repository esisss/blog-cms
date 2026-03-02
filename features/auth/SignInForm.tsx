"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "@/lib/auth-client";
import { FormField, FormAppError } from "@/components/FormField";
import type { ActionErrors, LoginInput } from "@/types";

export function SignInForm() {
  const router = useRouter();
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
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setActionErrors({
        type: "app",
        message: error.message ?? "An error occurred",
      });
      return;
    }

    setActionErrors(null);
    router.push("/");
    router.refresh();
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
