import AffiliateScreen from "@/screens/affiliate/AffiliateScreen";
import { getSiteSettings } from "@/api/site-settings";
import { buildSiteMetadata, systemPageSeo } from "@/utils/siteMetadata";
import type { Metadata } from "next";

// Meta tags are edited in admin → «SEO шаблон» → «Страницы сайта».
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  return buildSiteMetadata({ ...systemPageSeo(seo, "affiliate"), imageUrl: "/images/affiliate-hero-v1.png", path: "/affiliate" }, seo);
}

export default function AffiliatePage() {
  return <AffiliateScreen />;
}
