import { Navbar } from "@/components/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen m-0 p-0 flex flex-col items-center justify-center bg-base-200 ">
      <Navbar />
      {children}
    </div>
  );
}
