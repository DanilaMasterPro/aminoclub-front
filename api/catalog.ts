import api from "./client";
import { cache } from "react";
import type { CatalogProduct, Paginated } from "./types";

export async function getCatalogProducts(signal?: AbortSignal) {
  const { data } = await api.get<Paginated<CatalogProduct>>("/products", {
    params: { limit: 100 },
    signal,
  });

  return data.items;
}

export const getCatalogProduct = cache(async (slug: string): Promise<CatalogProduct | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const response = await fetch(`${apiUrl}/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
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
