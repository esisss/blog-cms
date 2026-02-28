export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-md shadow-xl">
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}
