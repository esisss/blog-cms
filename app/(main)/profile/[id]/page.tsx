import AuthorProfileView from "@/features/authors/AuthorProfileView";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  return <AuthorProfileView authorId={id} />;
}
