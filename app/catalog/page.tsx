import type { Metadata } from "next";
import { getCatalogCategories } from "@/api/catalog";
import { getSiteSettings } from "@/api/site-settings";
import CatalogScreen from "@/screens/catalog/CatalogScreen";
import { buildSiteMetadata, systemPageSeo } from "@/utils/siteMetadata";

export async function generateMetadata({ searchParams }: PageProps<"/catalog">): Promise<Metadata> {
  const { category: slug } = await searchParams;
  const [{ seo }, categories] = await Promise.all([getSiteSettings(), getCatalogCategories()]);
  const category = typeof slug === "string" ? categories.find((item) => item.slug === slug) : undefined;
  if (!category) return buildSiteMetadata({ ...systemPageSeo(seo, "catalog"), path: "/catalog" }, seo);
  // Category SEO fields from the admin; the template below is used only while they are empty.
  return buildSiteMetadata({
    title: category.seoTitle || `${category.title} — купить в интернет-магазине AMINOCLUB`,
    description: category.seoDescription || category.description || `${category.title} AMINOCLUB: состав, вкусы и цены. Доставка по России через Яндекс Доставку.`,
    keywords: category.seoKeywords?.length ? category.seoKeywords : [category.title, "AMINOCLUB", "спортивное питание"],
    imageUrl: category.imageUrl,
    path: `/catalog?category=${encodeURIComponent(category.slug)}`,
  }, seo);
}

export default async function CatalogPage({ searchParams }: PageProps<"/catalog">) {
  const { category } = await searchParams;
  return <CatalogScreen initialCategory={typeof category === "string" ? category : undefined} />;
}
