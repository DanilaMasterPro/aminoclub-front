import type { MetadataRoute } from "next";
import { serverApiUrl } from "@/api/server-api-url";
import { siteUrl } from "@/utils/siteUrl";

// Rebuilt at most hourly, so new products and pages appear without a deploy.
export const revalidate = 3600;

type Dated = { slug: string; updatedAt?: string; publishedAt?: string | null };

async function load<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${serverApiUrl}${path}`, { next: { revalidate: 3600 } });
    return response.ok ? ((await response.json()) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, pages, articles] = await Promise.all([
    load<{ items: Array<Dated & { category: { slug: string } }> }>("/products?limit=100", { items: [] }),
    load<Dated[]>("/pages", []),
    load<Dated[]>("/articles", []),
  ]);
  // Only categories that currently have products on sale.
  const categories = [...new Set(products.items.map((product) => product.category.slug))];

  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/catalog`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((slug) => ({ url: `${siteUrl}/catalog?category=${encodeURIComponent(slug)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.items.map((product) => ({ url: `${siteUrl}/catalog/${product.slug}`, lastModified: product.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${siteUrl}/affiliate`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contacts`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/news`, changeFrequency: "weekly", priority: 0.5 },
    ...articles.map((article) => ({ url: `${siteUrl}/news/${article.slug}`, lastModified: article.updatedAt ?? article.publishedAt ?? undefined, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...pages.map((page) => ({ url: `${siteUrl}/${page.slug}`, lastModified: page.updatedAt, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
