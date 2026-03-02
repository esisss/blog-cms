"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({
  className = "btn btn-ghost",
  children = "Sign out",
}: SignOutButtonProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    queryClient.clear();
    router.push("/signin");
    router.refresh();
  };

  return (
    <button type="button" onClick={handleSignOut} className={className}>
      {children}
    </button>
  );
}
