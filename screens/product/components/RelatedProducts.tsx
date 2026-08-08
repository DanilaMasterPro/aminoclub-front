"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "@/components/ProductCard";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";

export default function RelatedProducts({ productId }: { productId: string }) {
  const { products } = useCatalogProducts();
  const related = products.filter((product) => product.id !== productId).slice(0, 8);
  if (!related.length) return null;
  return (
    <section className="py-[120px] max-[700px]:py-20">
      <h2 className="mb-12 font-[family-name:var(--font-helvetica-neue)] text-[38px] font-normal tracking-[-0.03em]">Другие товары</h2>
      <Swiper modules={[Navigation]} navigation spaceBetween={24} slidesPerView={1} breakpoints={{ 700: { slidesPerView: 2 }, 1100: { slidesPerView: 3 }, 1450: { slidesPerView: 4 } }}>
        {related.map((product) => <SwiperSlide key={product.id} className="h-auto"><ProductCard product={product} /></SwiperSlide>)}
      </Swiper>
    </section>
  );
}
