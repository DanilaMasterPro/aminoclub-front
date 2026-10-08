import { resolveMediaUrl } from "@/api/media";
import type { SeoSystemPage, SiteSettings } from "@/api/types";
import { defaultSiteSettings } from "@/api/site-settings";
import type { Metadata } from "next";

type LocalSeo = {
  title?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  imageUrl?: string | null;
  /** Page path for the canonical URL, e.g. "/catalog". Resolved against metadataBase. */
  path?: string;
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
    ...(local.path ? { alternates: { canonical: local.path } } : {}),
    openGraph: {
      title,
      description,
      ...(local.path ? { url: local.path } : {}),
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

/** SEO of a code-built page from admin settings; falls back to the built-in default (e.g. an older API). */
export function systemPageSeo(seo: SiteSettings["seo"], page: SeoSystemPage) {
  return seo.pages?.[page] ?? defaultSiteSettings.seo.pages[page];
}
