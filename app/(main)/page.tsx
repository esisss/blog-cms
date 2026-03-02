import HomeFeed from "@/features/articles/HomeFeed";
import AuthorsListContainer from "@/features/authors/AuthorsListContainer";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Ultimos Artículos</h1>
          <HomeFeed />
        </div>
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-4">
            <AuthorsListContainer />
          </div>
        </aside>
      </div>
    </div>
  );
}
