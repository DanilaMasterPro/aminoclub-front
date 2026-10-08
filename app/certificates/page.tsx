import type { Metadata } from "next";
import { getCmsPage, getSiteSettings } from "@/api/site-settings";
import CertificatesScreen from "@/screens/certificates/CertificatesScreen";
import { buildSiteMetadata } from "@/utils/siteMetadata";

// Content and SEO come from the CMS page with slug "certificates" (admin → Страницы).
export async function generateMetadata(): Promise<Metadata> {
  const [page, { seo }] = await Promise.all([getCmsPage("certificates"), getSiteSettings()]);
  return buildSiteMetadata({
    title: page?.seoTitle || "Сертификаты качества — AMINOCLUB",
    description: page?.seoDescription || "Сертификаты и декларации соответствия на спортивное питание AMINOCLUB.",
    keywords: page?.seoKeywords,
    imageUrl: page?.imageUrls[0],
    path: "/certificates",
  }, seo);
}

export default async function CertificatesPage() {
  const page = await getCmsPage("certificates");
  return <CertificatesScreen page={page} />;
}
