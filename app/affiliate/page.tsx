import AffiliateScreen from "@/screens/affiliate/AffiliateScreen";
import { getSiteSettings } from "@/api/site-settings";
import { buildSiteMetadata } from "@/utils/siteMetadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  return buildSiteMetadata({
    title: "Партнёрская программа — AMINOCLUB",
    description: "Партнёрская программа AMINOCLUB для тренеров и спортивных экспертов.",
    imageUrl: "/images/affiliate-hero-v1.png",
  }, seo);
}

export default function AffiliatePage() {
  return <AffiliateScreen />;
}
