import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <Link className="font-bold fixed top-3 left-3 hover:underline" href="/">
        <ChevronLeft className="inline" />
        Back
      </Link>
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-xl">
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}
