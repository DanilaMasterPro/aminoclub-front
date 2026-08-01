import api from "./client";
import type { CatalogProduct, Paginated } from "./types";

export async function getCatalogProducts(signal?: AbortSignal) {
  const { data } = await api.get<Paginated<CatalogProduct>>("/products", {
    params: { limit: 100 },
    signal,
  });

  return data.items;
}

export function resolveProductImageUrl(url: string) {
  if (!url.startsWith("/uploads/")) return url;

  try {
    return new URL(url, new URL(process.env.NEXT_PUBLIC_API_URL!).origin).toString();
  } catch {
    return url;
  }
}
