import Image from "next/image";
import Link from "next/link";
import type { CmsArticle } from "@/api/types";
import { resolveMediaUrl } from "@/api/media";
import PublicPageShell from "@/components/PublicPageShell";
import RelatedArticles from "./components/RelatedArticles";

export default function ArticleScreen({ article, related }: { article: CmsArticle; related: CmsArticle[] }) {
  return (
    <PublicPageShell>
      <article className="px-3">
        <nav className="text-xs text-[#6d7271]"><Link href="/">Главная</Link> &nbsp;/&nbsp; <Link href="/news">Блог</Link> &nbsp;/&nbsp; {article.title}</nav>
        <header className="py-20 max-[700px]:py-12">
          <h1 className="max-w-[1050px] font-[family-name:var(--font-helvetica-neue)] text-[68px] leading-[0.98] font-normal tracking-[-0.05em] max-[900px]:text-[52px] max-[600px]:text-[40px]">{article.title}</h1>
          {article.excerpt && <p className="mt-8 max-w-[760px] text-sm leading-6 text-[#686d6c]">{article.excerpt}</p>}
        </header>
        {article.coverImageUrl && <div className="relative aspect-[2.8/1] min-h-[360px] overflow-hidden rounded-xl max-[700px]:min-h-[280px]"><Image src={resolveMediaUrl(article.coverImageUrl)} alt={article.title} fill priority className="object-cover" sizes="96vw" /></div>}
        <div className="mx-auto max-w-[820px] py-[140px] text-[17px] leading-8 text-[#656a69] max-[700px]:py-20 [&_h2]:mt-14 [&_h2]:mb-7 [&_h2]:font-[family-name:var(--font-helvetica-neue)] [&_h2]:text-[44px] [&_h2]:leading-[1] [&_h2]:font-normal [&_h2]:tracking-[-0.04em] [&_img]:my-12 [&_img]:w-full [&_img]:rounded-xl [&_p]:mb-7" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
      <RelatedArticles articles={related} />
    </PublicPageShell>
  );
}
