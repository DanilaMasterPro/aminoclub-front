import Image from "next/image";
import type { CmsArticle } from "@/api/types";
import { resolveMediaUrl } from "@/api/media";
import PublicPageShell from "@/components/PublicPageShell";
import RelatedArticles from "./components/RelatedArticles";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ArticleScreen({ article, related }: { article: CmsArticle; related: CmsArticle[] }) {
  return (
    <PublicPageShell>
      <article className="page-gutter">
        <Breadcrumbs items={[{ label: "Блог", href: "/news" }, { label: article.title, href: `/news/${article.slug}` }]} />
        <header className="py-20 max-[700px]:py-12">
          <h1 className="max-w-[1050px] break-words font-[family-name:var(--font-helvetica-neue)] text-[68px] leading-[0.98] font-normal tracking-[-0.05em] max-[900px]:text-[52px] max-[600px]:text-[34px]">{article.title}</h1>
          {article.excerpt && <p className="mt-8 max-w-[760px] text-sm leading-6 text-[#686d6c]">{article.excerpt}</p>}
        </header>
        {/* Narrower screens get a taller ratio. No min-height here: with aspect-ratio it turns into a min-width
            (360px × 2.8 ≈ 1000px) and the cover would stretch the page sideways on phones. */}
        {article.coverImageUrl && <div className="relative aspect-[2.8/1] overflow-hidden rounded-xl max-[1100px]:aspect-[2/1] max-[700px]:aspect-[4/3]"><Image src={resolveMediaUrl(article.coverImageUrl)} alt={article.title} fill priority className="object-cover" sizes="96vw" /></div>}
        {/* Admin HTML: nothing in it (images, videos, tables, long links) may be wider than the column. */}
        <div className="mx-auto max-w-[820px] py-[140px] text-[17px] leading-8 break-words text-[#656a69] max-[700px]:py-20 max-[700px]:text-base max-[700px]:leading-7 [&_h2]:mt-14 [&_h2]:mb-7 [&_h2]:font-[family-name:var(--font-helvetica-neue)] [&_h2]:text-[44px] [&_h2]:leading-[1] [&_h2]:font-normal [&_h2]:tracking-[-0.04em] max-[700px]:[&_h2]:text-[32px] [&_iframe]:max-w-full [&_img]:my-12 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl [&_p]:mb-7 [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_video]:h-auto [&_video]:max-w-full" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
      <RelatedArticles articles={related} />
    </PublicPageShell>
  );
}
