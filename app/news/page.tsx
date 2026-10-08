import type { Metadata } from "next";
import { getSiteSettings } from "@/api/site-settings";
import NewsScreen from "@/screens/news/NewsScreen";
import { buildSiteMetadata, systemPageSeo } from "@/utils/siteMetadata";

// Meta tags are edited in admin → «SEO шаблон» → «Страницы сайта».
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  return buildSiteMetadata({ ...systemPageSeo(seo, "news"), path: "/news" }, seo);
}

export default function NewsPage() { return <NewsScreen />; }
