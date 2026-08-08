import Image from "next/image";
import Link from "next/link";
import type { CmsArticle } from "@/api/types";
import { resolveMediaUrl } from "@/api/media";

export default function ArticleCard({ article, featured = false }: { article: CmsArticle; featured?: boolean }) {
  return (
    <article>
      <Link href={`/news/${article.slug}`} className={`group relative block overflow-hidden bg-[#e8e8e3] ${featured ? "aspect-[1.32/1]" : "aspect-[1.2/1]"}`}>
        {article.coverImageUrl && <Image src={resolveMediaUrl(article.coverImageUrl)} alt={article.title} fill className="object-cover transition duration-500 group-hover:scale-[1.025]" sizes={featured ? "(max-width: 800px) 94vw, 48vw" : "(max-width: 800px) 94vw, 24vw"} />}
        <span className={`absolute top-5 right-5 grid place-items-center rounded-full text-white ${featured ? "size-14 bg-black" : "size-9 bg-[#009d0a]"}`}>
          <Image src="/icons/arrow-up-right.svg" alt="" width={featured ? 14 : 11} height={featured ? 15 : 12} />
        </span>
      </Link>
      <h2 className={`mt-6 font-[family-name:var(--font-helvetica-neue)] leading-[1.08] font-normal tracking-[-0.035em] ${featured ? "text-[30px]" : "text-[21px]"}`}><Link href={`/news/${article.slug}`}>{article.title}</Link></h2>
    </article>
  );
}
