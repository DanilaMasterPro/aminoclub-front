import type { CmsArticle } from "@/api/types";
import ArticleCard from "@/components/ArticleCard";

export default function NewsGrid({ articles }: { articles: CmsArticle[] }) {
  const featured = articles.slice(0, 2);
  const rest = articles.slice(2);
  return (
    <>
      <div className="grid grid-cols-2 gap-12 max-[800px]:grid-cols-1">{featured.map((article) => <ArticleCard key={article.id} article={article} featured />)}</div>
      <div className="mt-24 grid grid-cols-4 gap-x-6 gap-y-24 max-[1100px]:grid-cols-3 max-[800px]:grid-cols-2 max-[550px]:grid-cols-1">{rest.map((article) => <ArticleCard key={article.id} article={article} />)}</div>
    </>
  );
}
