import { cache } from "react";
import { serverApiUrl } from "./server-api-url";
import type { CmsArticle } from "./types";

const apiUrl = serverApiUrl;

export const getArticles = cache(async (): Promise<CmsArticle[]> => {
  if (!apiUrl) return [];
  try {
    const response = await fetch(`${apiUrl}/articles`, { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json() as CmsArticle[];
  } catch {
    return [];
  }
});

export const getArticle = cache(async (slug: string): Promise<CmsArticle | null> => {
  if (!apiUrl) return null;
  try {
    const response = await fetch(`${apiUrl}/articles/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json() as CmsArticle;
  } catch {
    return null;
  }
});
