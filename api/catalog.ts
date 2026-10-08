import api from "./client";
import { cache } from "react";
import { serverApiUrl } from "./server-api-url";
import type { CatalogCategory, CatalogProduct, Paginated } from "./types";

export async function getCatalogProducts(signal?: AbortSignal) {
  const { data } = await api.get<Paginated<CatalogProduct>>("/products", {
    params: { limit: 100 },
    signal,
  });

  return data.items;
}

export const getCatalogProduct = cache(async (slug: string): Promise<CatalogProduct | null> => {
  if (!serverApiUrl) return null;
  try {
    const response = await fetch(`${serverApiUrl}/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json() as CatalogProduct;
  } catch {
    return null;
  }
});

export function resolveProductImageUrl(url: string) {
  if (!url.startsWith("/uploads/")) return url;

  try {
    return new URL(url, new URL(process.env.NEXT_PUBLIC_API_URL!).origin).toString();
  } catch {
    return url;
  }
}

export type CatalogCategoryInfo = CatalogCategory & { seoTitle: string | null; seoDescription: string | null; description: string | null };

/** Server-side category list (SEO metadata of the catalog page). */
export const getCatalogCategories = cache(async (): Promise<CatalogCategoryInfo[]> => {
  if (!serverApiUrl) return [];
  try {
    const response = await fetch(`${serverApiUrl}/categories`, { cache: "no-store" });
    return response.ok ? ((await response.json()) as CatalogCategoryInfo[]) : [];
  } catch {
    return [];
  }
});
