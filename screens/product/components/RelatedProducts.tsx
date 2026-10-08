"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "@/components/ProductCard";
import { SliderArrow, useSliderControls } from "@/components/SliderControls";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";

export default function RelatedProducts({ productId }: { productId: string }) {
  const { products } = useCatalogProducts();
  const slider = useSliderControls();
  const related = products.filter((product) => product.id !== productId).slice(0, 8);
  if (!related.length) return null;
  return (
    <section className="py-[120px] max-[700px]:py-20">
      <div className="mb-12 flex items-center justify-between gap-6">
        <h2 className="font-[family-name:var(--font-helvetica-neue)] text-[38px] font-normal tracking-[-0.03em]">Другие товары</h2>
        {!slider.isLocked && (
          <div className="flex gap-3">
            <SliderArrow direction="prev" onClick={slider.prev} disabled={slider.isBeginning} />
            <SliderArrow direction="next" onClick={slider.next} disabled={slider.isEnd} />
          </div>
        )}
      </div>
      <Swiper
        onSwiper={slider.onSwiper}
        onSlideChange={slider.sync}
        onResize={slider.sync}
        onLock={slider.sync}
        onUnlock={slider.sync}
        watchOverflow
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{ 700: { slidesPerView: 2 }, 1100: { slidesPerView: 3 }, 1450: { slidesPerView: 4 } }}
      >
        {related.map((product) => <SwiperSlide key={product.id} className="h-auto"><ProductCard product={product} /></SwiperSlide>)}
      </Swiper>
    </section>
  );
}
