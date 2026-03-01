"use client";

import { useSearchParams } from "next/navigation";
import { PostModal } from "@/components/PostModal";

export function PostModalWrapper() {
  const searchParams = useSearchParams();
  const createPost = searchParams.get("createPost");

  if (createPost !== "true") {
    return null;
  }

  return <PostModal />;
}
