import type { CatalogProduct } from "@/api/types";
import ProductCard from "@/components/ProductCard";

export default function CatalogGrid({ products, isLoading }: { products: CatalogProduct[]; isLoading: boolean }) {
  if (isLoading) return <div className="grid grid-cols-3 gap-8 max-[1250px]:grid-cols-2 max-[700px]:grid-cols-1">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-[480px] animate-pulse rounded-[22px] bg-[#fcfbf8]" />)}</div>;
  if (!products.length) return <p className="rounded-[20px] bg-[#fcfbf8] p-10 text-center text-[#656a6a]">По выбранным фильтрам ничего не найдено.</p>;
  return <div className="grid grid-cols-3 gap-8 max-[1250px]:grid-cols-2 max-[700px]:grid-cols-1">{products.map((product, index) => <ProductCard key={product.id} product={product} animationDelay={index * 0.05} />)}</div>;
}
