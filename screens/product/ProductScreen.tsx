import type { CatalogProduct } from "@/api/types";
import PublicPageShell from "@/components/PublicPageShell";
import ProductGallery from "./components/ProductGallery";
import ProductDetails from "./components/ProductDetails";
import RelatedProducts from "./components/RelatedProducts";

export default function ProductScreen({ product }: { product: CatalogProduct }) {
  return (
    <PublicPageShell>
      <section className="grid grid-cols-[1.1fr_.9fr] gap-[90px] px-7 pb-4 max-[1200px]:gap-10 max-[1000px]:grid-cols-1 max-[600px]:px-1">
        <ProductGallery product={product} />
        <ProductDetails product={product} />
      </section>
      <RelatedProducts productId={product.id} />
    </PublicPageShell>
  );
}
