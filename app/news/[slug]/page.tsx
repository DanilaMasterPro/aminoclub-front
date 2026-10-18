import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/api/content";
import { getSiteSettings } from "@/api/site-settings";
import ArticleScreen from "@/screens/article/ArticleScreen";
import { buildSiteMetadata } from "@/utils/siteMetadata";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const slug = (await params).slug;
  const [article, { seo }] = await Promise.all([getArticle(slug), getSiteSettings()]);
  if (!article) return {};
  return buildSiteMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    keywords: article.seoKeywords,
    imageUrl: article.coverImageUrl,
    path: `/news/${article.slug}`,
  }, seo);
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const slug = (await params).slug;
  const article = await getArticle(slug);
  if (!article) notFound();
  const articles = await getArticles();
  return <ArticleScreen article={article} related={articles.filter((item) => item.id !== article.id)} />;
}
