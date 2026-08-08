import { getCmsPage, getSiteSettings } from "@/api/site-settings";
import ContentPageScreen from "@/screens/content-page/ContentPageScreen";
import { buildSiteMetadata } from "@/utils/siteMetadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getCmsPage(slug), getSiteSettings()]);

  if (!page) return buildSiteMetadata({}, settings.seo);
  return buildSiteMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    keywords: page.seoKeywords,
    imageUrl: page.imageUrls[0],
  }, settings.seo);
}

export default async function CmsPageRoute({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  if (!page) notFound();
  return <ContentPageScreen page={page} />;
}
