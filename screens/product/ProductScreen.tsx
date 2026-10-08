import type { CatalogProduct } from "@/api/types";
import PublicPageShell from "@/components/PublicPageShell";
import ProductGallery from "./components/ProductGallery";
import ProductDetails from "./components/ProductDetails";
import RelatedProducts from "./components/RelatedProducts";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductJsonLd from "./components/ProductJsonLd";

export default function ProductScreen({ product }: { product: CatalogProduct }) {
  return (
    <PublicPageShell>
      <ProductJsonLd product={product} />
      <Breadcrumbs
        className="page-gutter mb-8"
        items={[
          { label: "Каталог", href: "/catalog" },
          { label: product.category.title, href: `/catalog?category=${product.category.slug}` },
          { label: `${product.title}${product.flavor ? ` ${product.flavor}` : ""}`, href: `/catalog/${product.slug}` },
        ]}
      />
      {/* The gallery column is exactly the gallery square (capped by the viewport height), so no empty band appears between photo and text. */}
      <section className="grid grid-cols-[min(55%,calc(100svh-220px))_minmax(0,1fr)] gap-16 page-gutter pb-4 max-[1200px]:gap-10 max-[1000px]:grid-cols-1">
        <ProductGallery product={product} />
        <ProductDetails product={product} />
      </section>
      <RelatedProducts productId={product.id} />
    </PublicPageShell>
  );
}
