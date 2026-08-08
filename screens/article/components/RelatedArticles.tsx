import ArticleCard from "@/components/ArticleCard";
import type { CmsArticle } from "@/api/types";

export default function RelatedArticles({ articles }: { articles: CmsArticle[] }) {
  if (!articles.length) return null;
  return (
    <section className="py-[140px] max-[700px]:py-20">
      <h2 className="mb-12 text-[22px] font-medium">Другие статьи</h2>
      <div className="grid grid-cols-3 gap-8 max-[800px]:grid-cols-1">{articles.slice(0, 3).map((article) => <ArticleCard key={article.id} article={article} />)}</div>
    </section>
  );
}
