"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";

export function AuthCacheSync() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const previousUserId = useRef<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const currentUserId = session?.user?.id ?? null;

    if (!initialized.current) {
      previousUserId.current = currentUserId;
      initialized.current = true;
      return;
    }

    if (previousUserId.current !== currentUserId) {
      queryClient.invalidateQueries({ refetchType: "active" });
      previousUserId.current = currentUserId;
    }
  }, [queryClient, session?.user?.id]);

  return null;
}
