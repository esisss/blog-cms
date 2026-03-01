import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)]  w-screen flex flex-col justify-start items-center">
      <div className="w-full max-w-3xl my-5">
        <Link className="font-bold my-2 " href="/">
          <ChevronLeft className="inline" /> Volver al feed
        </Link>
      </div>
      {children}
    </div>
  );
}
