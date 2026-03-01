export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-base-200 p-0">
      <div className="card-body">{children}</div>
    </div>
  );
}
