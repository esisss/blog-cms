import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { PostModalWrapper } from "@/components/PostModalWrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200 ">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="w-screen ">{children}</main>
      <Suspense fallback={null}>
        <PostModalWrapper />
      </Suspense>
    </div>
  );
}
