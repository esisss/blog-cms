"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormAppError, FormField } from "@/components/FormField";
import { useArticleMutations } from "@/hooks/useArticleMutations";
import { fromAppError, fromTrpcError } from "@/lib/errors";
import { validateImageUrl } from "@/lib/validate-image";
import type { ActionErrors, CreateArticleInput } from "@/types";

interface ArticleFormProps {
  mode?: "create" | "edit";
  article?: {
    id: string;
    title: string;
    text: string;
    coverImageUrl: string;
  };
  onSuccess?: () => void;
}

export function ArticleForm({
  mode = "create",
  article,
  onSuccess,
}: ArticleFormProps) {
  const router = useRouter();
  const [actionErrors, setActionErrors] = useState<ActionErrors | null>(null);
  const { createArticle, updateArticle } = useArticleMutations();

  const isEditMode = mode === "edit" && article;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateArticleInput>({
    defaultValues: {
      title: article?.title ?? "",
      text: article?.text ?? "",
      coverImageUrl: article?.coverImageUrl ?? "",
    },
  });

  const onSubmit = async (values: CreateArticleInput) => {
    try {
      if (isEditMode) {
        await updateArticle.mutateAsync({ id: article.id, ...values });
        toast.success("Article updated successfully!");
      } else {
        await createArticle.mutateAsync(values);
        toast.success("Article created successfully!");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(isEditMode ? `/article/${article.id}` : "/");
      }
    } catch (error) {
      const trpcError = fromTrpcError(error);
      setActionErrors(
        trpcError ?? fromAppError("An unexpected error occurred"),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full space-y-4"
    >
      <FormField<CreateArticleInput>
        name="title"
        label="Title"
        placeholder="Enter article title"
        register={register}
        error={errors.title}
        actionErrors={actionErrors}
        rules={{ required: "Title is required" }}
      />

      <FormField<CreateArticleInput>
        name="coverImageUrl"
        label="Cover Image URL"
        type="url"
        placeholder="https://example.com/image.jpg"
        register={register}
        error={errors.coverImageUrl}
        actionErrors={actionErrors}
        rules={{
          required: "Cover image URL is required",
          validate: async (value) => {
            if (!value) return true;
            const isValid = await validateImageUrl(value);
            return isValid || "Please enter a valid image URL";
          },
        }}
      />

      <FormField<CreateArticleInput>
        name="text"
        label="Content"
        as="textarea"
        placeholder="Write your article content here..."
        register={register}
        error={errors.text}
        actionErrors={actionErrors}
        rules={{ required: "Content is required" }}
      />

      <FormAppError actionErrors={actionErrors} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting && <span className="loading loading-spinner" />}
        {isEditMode ? "Update" : "Publish"}
      </button>
    </form>
  );
}
