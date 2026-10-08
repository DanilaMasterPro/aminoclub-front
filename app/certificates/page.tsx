import type { Metadata } from "next";
import { getCmsPage } from "@/api/site-settings";
import CertificatesScreen from "@/screens/certificates/CertificatesScreen";

// Content comes from the CMS page with slug "certificates" (admin → Страницы).
export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage("certificates");
  return {
    title: page?.seoTitle || "Сертификаты качества — AMINOCLUB",
    description: page?.seoDescription || "Сертификаты и декларации соответствия на спортивное питание AMINOCLUB.",
    alternates: { canonical: "/certificates" },
  };
}

export default async function CertificatesPage() {
  const page = await getCmsPage("certificates");
  return <CertificatesScreen page={page} />;
}
