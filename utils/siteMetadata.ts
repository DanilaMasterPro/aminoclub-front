import { resolveMediaUrl } from "@/api/media";
import type { SiteSettings } from "@/api/types";
import type { Metadata } from "next";

type LocalSeo = {
  title?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  imageUrl?: string | null;
};

export function buildSiteMetadata(local: LocalSeo, global: SiteSettings["seo"]): Metadata {
  const title = local.title?.trim() || global.title;
  const description = local.description?.trim() || global.description;
  const keywords = local.keywords?.length ? local.keywords : global.keywords;
  const imageUrl = local.imageUrl?.trim() || global.imageUrl;
  const resolvedImageUrl = imageUrl ? resolveMediaUrl(imageUrl) : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: "AMINOCLUB",
      locale: "ru_RU",
      type: "website",
      images: resolvedImageUrl ? [resolvedImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolvedImageUrl ? [resolvedImageUrl] : undefined,
    },
  };
}
