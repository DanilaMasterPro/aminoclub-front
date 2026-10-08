import type { Metadata } from "next";
import { getCatalogCategories } from "@/api/catalog";
import CatalogScreen from "@/screens/catalog/CatalogScreen";

export async function generateMetadata({ searchParams }: PageProps<"/catalog">): Promise<Metadata> {
  const { category: slug } = await searchParams;
  const category = typeof slug === "string" ? (await getCatalogCategories()).find((item) => item.slug === slug) : undefined;
  if (!category) {
    return {
      title: "Каталог спортивного питания — AMINOCLUB",
      description: "Протеин, BCAA, креатин, L-карнитин, глютамин и аргинин AMINOCLUB. Доставка по России через Яндекс Доставку.",
      alternates: { canonical: "/catalog" },
    };
  }
  const path = `/catalog?category=${encodeURIComponent(category.slug)}`;
  return {
    title: category.seoTitle || `${category.title} — купить в интернет-магазине AMINOCLUB`,
    description: category.seoDescription || category.description || `${category.title} AMINOCLUB: состав, вкусы и цены. Доставка по России через Яндекс Доставку.`,
    alternates: { canonical: path },
    openGraph: { url: path },
  };
}

export default async function CatalogPage({ searchParams }: PageProps<"/catalog">) {
  const { category } = await searchParams;
  return <CatalogScreen initialCategory={typeof category === "string" ? category : undefined} />;
}
