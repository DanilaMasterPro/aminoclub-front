import type { CmsPage } from "@/api/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import PublicPageShell from "@/components/PublicPageShell";
import CertificatesGrid from "./components/CertificatesGrid";

export default function CertificatesScreen({ page }: { page: CmsPage | null }) {
  const title = page?.title || "Сертификаты";
  return (
    <PublicPageShell>
      <section className="page-gutter pb-[120px] max-[600px]:pb-20">
        <Breadcrumbs className="mb-8" items={[{ label: title, href: "/certificates" }]} />
        <h1 className="font-[family-name:var(--font-helvetica-neue)] text-[64px] leading-[0.98] font-normal tracking-[-0.045em] max-[1000px]:text-[52px] max-[600px]:text-[38px]">
          {page?.heading || "Сертификаты качества"}
        </h1>
        {page?.content && (
          <div
            className="mt-8 max-w-[840px] text-base leading-8 text-[#535958] max-[600px]:text-sm max-[600px]:leading-7 [&_a]:text-[#009d0a] [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
        <CertificatesGrid imageUrls={page?.imageUrls ?? []} />
      </section>
    </PublicPageShell>
  );
}
