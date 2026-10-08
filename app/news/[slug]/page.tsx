import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/api/content";
import { getSiteSettings } from "@/api/site-settings";
import { getMockArticle, mockArticles } from "@/mock/articles";
import ArticleScreen from "@/screens/article/ArticleScreen";
import { buildSiteMetadata } from "@/utils/siteMetadata";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const slug = (await params).slug;
  const [article, { seo }] = await Promise.all([getArticle(slug).then((found) => found || getMockArticle(slug)), getSiteSettings()]);
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
  const article = await getArticle(slug) || getMockArticle(slug);
  if (!article) notFound();
  const apiArticles = await getArticles();
  const all = apiArticles.length ? apiArticles : mockArticles;
  return <ArticleScreen article={article} related={all.filter((item) => item.id !== article.id)} />;
}
