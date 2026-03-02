"use client";

import type { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import type { ActionErrors } from "@/types";

type InputType = "text" | "email" | "password" | "url";

interface FormFieldBaseProps<T extends FieldValues> {
  /** Field name - must match a key in the form values */
  name: Path<T>;
  /** Label text displayed above the field */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** react-hook-form register function */
  register: UseFormRegister<T>;
  /** Field error from react-hook-form formState.errors */
  error?: FieldError;
  /** Server-side action errors (zod validation or app errors) */
  actionErrors?: ActionErrors | null;
  /** Validation rules for react-hook-form */
  rules?: RegisterOptions<T, Path<T>>;
  /** HTML autocomplete attribute */
  autoComplete?: string;
}

interface InputFieldProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  /** Render as input (default) */
  as?: "input";
  /** Input type */
  type?: InputType;
}

interface TextareaFieldProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  /** Render as textarea */
  as: "textarea";
  /** Textarea rows */
  rows?: number;
}

type FormFieldProps<T extends FieldValues> = InputFieldProps<T> | TextareaFieldProps<T>;

/**
 * Helper to extract field error message from actionErrors
 */
function getActionFieldError(
  actionErrors: ActionErrors | null | undefined,
  fieldName: string
): string | undefined {
  if (!actionErrors || actionErrors.type !== "zod") return undefined;
  const fieldErrors = actionErrors.data.fieldErrors[fieldName];
  return fieldErrors?.length ? fieldErrors[0] : undefined;
}

/**
 * Reusable form field component that handles:
 * - Label rendering
 * - Input/Textarea rendering with proper styling
 * - Error display from react-hook-form OR server actionErrors
 */
export function FormField<T extends FieldValues>(props: FormFieldProps<T>) {
  const {
    name,
    label,
    placeholder,
    register,
    error,
    actionErrors,
    rules,
    autoComplete,
  } = props;

  const actionFieldError = getActionFieldError(actionErrors, name);
  const errorMessage = error?.message ?? actionFieldError;

  const inputClasses = props.as === "textarea"
    ? "textarea textarea-bordered w-full"
    : "input input-bordered w-full";

  return (
    <div className="form-control flex flex-col">
      <label htmlFor={name} className="label">
        <span className="label-text">{label}</span>
      </label>

      {props.as === "textarea" ? (
        <textarea
          id={name}
          placeholder={placeholder}
          className={`${inputClasses} h-40`}
          rows={props.rows}
          {...register(name, rules)}
        />
      ) : (
        <input
          id={name}
          type={props.type ?? "text"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={inputClasses}
          {...register(name, rules)}
        />
      )}

      {errorMessage && (
        <div className="label">
          <span className="label-text-alt text-error">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Displays app-level errors (non-field-specific)
 */
export function FormAppError({ actionErrors }: { actionErrors?: ActionErrors | null }) {
  if (!actionErrors || actionErrors.type !== "app") return null;

  return (
    <div role="alert" className="alert alert-error">
      <span>{actionErrors.message}</span>
    </div>
  );
}
