import { resolveMediaUrl } from "@/api/media";
import type { CmsPage } from "@/api/types";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function ContentPageScreen({ page }: { page: CmsPage }) {
  const imageUrl = page.imageUrls[0];

  return (
    <main id="top" className="mx-auto my-7 w-[min(100%_-_56px,_1920px)] max-[600px]:my-3 max-[600px]:w-[min(100%_-_24px,_1920px)]">
      <div className="relative rounded-[28px] bg-[#f8f8f8] max-[680px]:rounded-[20px]">
        <Header homeHref="/" catalogHref="/#catalog" />
        <section className="px-8 pt-[190px] pb-16 max-[1200px]:pt-40 max-[600px]:px-5 max-[600px]:pt-28 max-[600px]:pb-10">
          <nav className="flex items-center gap-2 text-xs text-[#747978]" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-[#15191a]">Главная</Link><span>/</span><span>{page.title}</span>
          </nav>
          <h1 className="mt-12 max-w-[1000px] font-[family-name:var(--font-helvetica-neue)] text-[64px] leading-[0.98] font-normal tracking-[-0.035em] max-[1000px]:text-[52px] max-[600px]:mt-8 max-[600px]:text-[38px]">
            {page.heading}
          </h1>
        </section>
      </div>

      {imageUrl && (
        <div className="relative mt-7 aspect-[12/5] overflow-hidden rounded-[18px] max-[700px]:h-[320px] max-[700px]:aspect-auto">
          <Image src={resolveMediaUrl(imageUrl)} alt={page.heading} fill priority sizes="96vw" className="object-cover" />
        </div>
      )}

      <article
        className="mx-auto max-w-[840px] py-[100px] text-base leading-8 text-[#535958] max-[700px]:py-16 max-[600px]:text-sm max-[600px]:leading-7 [&_a]:text-[#009d0a] [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-3xl [&_h2]:font-medium [&_h3]:mt-9 [&_h3]:mb-4 [&_h3]:text-xl [&_h3]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-6"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />

      <Footer />
    </main>
  );
}
