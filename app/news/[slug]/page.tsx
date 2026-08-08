import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/api/content";
import { getMockArticle, mockArticles } from "@/mock/articles";
import ArticleScreen from "@/screens/article/ArticleScreen";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getArticle(slug) || getMockArticle(slug);
  return article ? { title: article.seoTitle || article.title, description: article.seoDescription || article.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const slug = (await params).slug;
  const article = await getArticle(slug) || getMockArticle(slug);
  if (!article) notFound();
  const apiArticles = await getArticles();
  const all = apiArticles.length ? apiArticles : mockArticles;
  return <ArticleScreen article={article} related={all.filter((item) => item.id !== article.id)} />;
}
