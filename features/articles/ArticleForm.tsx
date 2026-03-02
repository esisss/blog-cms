"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { fromAppError, fromTrpcError } from "@/lib/errors";
import { useTRPC } from "@/lib/trpc/client";
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

export function ArticleForm({ mode = "create", article, onSuccess }: ArticleFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [actionErrors, setActionErrors] = useState<ActionErrors | null>(null);

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

  const createArticleMutation = useMutation(
    trpc.articles.createArticle.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.articles.getArticles.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.authors.getAuthors.queryKey(),
          }),
        ]);
      },
    }),
  );

  const updateArticleMutation = useMutation(
    trpc.articles.updateArticle.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.articles.getArticles.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.articles.getArticleById.queryKey({ id: article?.id ?? "" }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.articles.getArticlesByAuthor.queryKey(),
          }),
        ]);
      },
    }),
  );

  const onSubmit = async (values: CreateArticleInput) => {
    try {
      if (isEditMode) {
        await updateArticleMutation.mutateAsync({
          id: article.id,
          ...values,
        });
        toast.success("Article updated successfully!");
      } else {
        await createArticleMutation.mutateAsync(values);
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
      className="w-full space-y-4 "
    >
      <div className="form-control flex flex-col">
        <label htmlFor="title" className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter article title"
          className="input input-bordered w-full"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {errors.title.message}
            </span>
          </div>
        ) : actionErrors?.type === "zod" &&
          actionErrors.data.fieldErrors.title?.length ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {actionErrors.data.fieldErrors.title[0]}
            </span>
          </div>
        ) : null}
      </div>

      <div className="form-control flex flex-col">
        <label htmlFor="coverImageUrl" className="label">
          <span className="label-text">Cover Image URL</span>
        </label>
        <input
          id="coverImageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          className="input input-bordered w-full"
          {...register("coverImageUrl", {
            required: "Cover image URL is required",
          })}
        />
        {errors.coverImageUrl ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {errors.coverImageUrl.message}
            </span>
          </div>
        ) : actionErrors?.type === "zod" &&
          actionErrors.data.fieldErrors.coverImageUrl?.length ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {actionErrors.data.fieldErrors.coverImageUrl[0]}
            </span>
          </div>
        ) : null}
      </div>

      <div className="form-control flex flex-col">
        <label htmlFor="text" className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea
          id="text"
          placeholder="Write your article content here..."
          className="textarea textarea-bordered h-40 w-full"
          {...register("text", { required: "Content is required" })}
        />
        {errors.text ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {errors.text.message}
            </span>
          </div>
        ) : actionErrors?.type === "zod" &&
          actionErrors.data.fieldErrors.text?.length ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {actionErrors.data.fieldErrors.text[0]}
            </span>
          </div>
        ) : null}
      </div>

      {actionErrors?.type === "app" ? (
        <div role="alert" className="alert alert-error">
          <span>{actionErrors.message}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner"></span>
        ) : null}
        {isEditMode ? "Update" : "Publish"}
      </button>
    </form>
  );
}
