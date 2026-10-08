import PublicPageShell from "@/components/PublicPageShell";
import { getArticles } from "@/api/content";
import { mockArticles } from "@/mock/articles";
import NewsGrid from "./components/NewsGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function NewsScreen() {
  const apiArticles = await getArticles();
  const articles = apiArticles.length ? apiArticles : mockArticles;
  return (
    <PublicPageShell>
      <section className="page-gutter pb-[150px] max-[600px]:pb-20">
        <Breadcrumbs className="mb-8" items={[{ label: "Блог", href: "/news" }]} />
        <h1 className="mb-[140px] font-[family-name:var(--font-helvetica-neue)] text-[84px] font-normal tracking-[-0.055em] max-[900px]:mb-20 max-[600px]:text-[58px]">БЛОГ</h1>
        <NewsGrid articles={articles} />
      </section>
    </PublicPageShell>
  );
}
