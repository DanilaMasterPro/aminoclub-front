import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogProduct } from "@/api/catalog";
import { getSiteSettings } from "@/api/site-settings";
import ProductScreen from "@/screens/product/ProductScreen";
import { productPhoto } from "@/utils/productMedia";
import { buildSiteMetadata } from "@/utils/siteMetadata";
import { stripHtml } from "@/utils/stripHtml";
import { truncateText } from "@/utils/truncateText";

// Product SEO fields from the admin; the product title/description are used while they are empty.
export async function generateMetadata({ params }: PageProps<"/catalog/[slug]">): Promise<Metadata> {
  const [product, { seo }] = await Promise.all([getCatalogProduct((await params).slug), getSiteSettings()]);
  if (!product) return {};
  return buildSiteMetadata({
    title: product.seoTitle || `${product.title}${product.flavor ? ` ${product.flavor}` : ""} — AMINOCLUB`,
    description: product.seoDescription || truncateText(stripHtml(product.description), 160),
    keywords: product.seoKeywords,
    imageUrl: productPhoto(product)?.url,
    path: `/catalog/${product.slug}`,
  }, seo);
}

export default async function ProductPage({ params }: PageProps<"/catalog/[slug]">) {
  const product = await getCatalogProduct((await params).slug);
  if (!product) notFound();
  return <ProductScreen product={product} />;
}
