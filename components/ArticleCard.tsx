import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/schemas";

type SerializedArticle = Omit<Article, "createdAt"> & {
  createdAt: string | Date;
};

interface ArticleCardProps {
  article: SerializedArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <Link href={`/article/${article.id}`}>
      <article className="card card-side h-44 bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <figure className="w-48 shrink-0">
          <Image
            width={192}
            height={128}
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title line-clamp-2">{article.title}</h2>
          <p className="text-base-content/70 line-clamp-3">{article.text}</p>
          <div className="card-actions justify-end mt-2">
            <span className="text-sm text-base-content/50">
              {formattedDate}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
