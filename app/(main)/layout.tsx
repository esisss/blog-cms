import { Navbar } from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Navbar />
      <main className="flex-1 w-full max-w-2xl mx-auto p-2 sm:p-0">
        {children}
      </main>
    </div>
  );
}
