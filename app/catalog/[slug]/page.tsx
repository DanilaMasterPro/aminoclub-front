import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogProduct } from "@/api/catalog";
import ProductScreen from "@/screens/product/ProductScreen";

export async function generateMetadata({ params }: PageProps<"/catalog/[slug]">): Promise<Metadata> {
  const product = await getCatalogProduct((await params).slug);
  return product ? { title: product.title, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/catalog/[slug]">) {
  const product = await getCatalogProduct((await params).slug);
  if (!product) notFound();
  return <ProductScreen product={product} />;
}
