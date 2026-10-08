import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogProduct, resolveProductImageUrl } from "@/api/catalog";
import { productPhoto } from "@/utils/productMedia";
import ProductScreen from "@/screens/product/ProductScreen";
import { stripHtml } from "@/utils/stripHtml";
import { truncateText } from "@/utils/truncateText";

export async function generateMetadata({ params }: PageProps<"/catalog/[slug]">): Promise<Metadata> {
  const product = await getCatalogProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || truncateText(stripHtml(product.description), 160),
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: { url: `/catalog/${product.slug}`, images: productPhoto(product) ? [resolveProductImageUrl(productPhoto(product)!.url)] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/catalog/[slug]">) {
  const product = await getCatalogProduct((await params).slug);
  if (!product) notFound();
  return <ProductScreen product={product} />;
}
