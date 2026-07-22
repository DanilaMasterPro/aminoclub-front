"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { products, type Product } from "@/mock/products";
import ProductCard from "../../../components/ProductCard";

type Category = "all" | Product["category"];

const tabs: Array<{ id: Category; label: string }> = [
  { id: "all", label: "Все" },
  { id: "proteins", label: "Протеины" },
  { id: "amino-acids", label: "Аминокислоты" },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const visibleProducts = useMemo(() => (activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)), [activeCategory]);

  return (
    <section id="catalog" className="px-[1%]" aria-label="Каталог продуктов">
      <div data-fade-up className="mb-[58px] flex flex-wrap gap-3.5 max-[600px]:mb-[30px] max-[600px]:flex-nowrap max-[600px]:overflow-x-auto max-[600px]:pb-1" role="tablist" aria-label="Категории товаров">
        {tabs.map((tab) => {
          const isActive = tab.id === activeCategory;
          return (
            <button
              key={tab.id}
              className={`shrink-0 cursor-pointer rounded-full border-0 px-5 py-[11px] text-base transition-colors ${isActive ? "bg-[#151a1c] text-white" : "bg-[#f8f8f8] text-[#151a1c]"}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(tab.id)}>
              {tab.label}
            </button>
          );
        })}
      </div>
      <Swiper
        key={activeCategory}
        slidesPerView={1.12}
        spaceBetween={20}
        grabCursor
        watchOverflow
        breakpoints={{ 700: { slidesPerView: 2, spaceBetween: 26 }, 1100: { slidesPerView: 3, spaceBetween: 36 }, 1440: { slidesPerView: 4, spaceBetween: 36 } }}
        className="!overflow-hidden">
        {visibleProducts.map((product, index) => (
          <SwiperSlide key={product.id} className="h-auto">
            <ProductCard product={product} animationDelay={index * 0.08} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
