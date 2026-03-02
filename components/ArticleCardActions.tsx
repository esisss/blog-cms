import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface ArticleCardActionsProps {
  articleId: string;
  onDelete: () => void;
}

export default function ArticleCardActions({
  articleId,
  onDelete,
}: ArticleCardActionsProps) {
  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        tabIndex={0}
        aria-label="Article actions"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <MoreVertical size={18} />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box shadow-md border border-base-200 min-w-36"
      >
        <li>
          <Link href={`/article/${articleId}?edit=true`} className="text-sm">
            <Pencil size={14} />
            Editar
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="text-sm text-error"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </li>
      </ul>
    </div>
  );
}
