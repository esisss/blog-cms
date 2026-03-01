import { ArticleForm } from "@/features/articles/ArticleForm";

export default function PostPage() {
  return (
    <div className="card bg-base-100 w-full max-w-2xl shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold mb-6">Create New Article</h2>
        <ArticleForm />
      </div>
    </div>
  );
}
