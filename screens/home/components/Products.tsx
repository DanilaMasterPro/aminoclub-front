"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { CatalogProduct } from "@/api/types";
import ProductCard from "../../../components/ProductCard";
import { useCatalogProducts } from "../hooks/useCatalogProducts";

export default function Products() {
  const { products, isLoading, error, reload } = useCatalogProducts();
  const [activeCategory, setActiveCategory] = useState("all");

  const tabs = useMemo(() => {
    const categories = new Map<string, CatalogProduct["category"]>();
    products.forEach((product) => categories.set(product.category.slug, product.category));

    return [
      { id: "all", label: "Все", sortOrder: -1 },
      ...Array.from(categories.values())
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((category) => ({ id: category.slug, label: category.title, sortOrder: category.sortOrder })),
    ];
  }, [products]);

  const visibleProducts = useMemo(
    () => (activeCategory === "all" ? products : products.filter((product) => product.category.slug === activeCategory)),
    [activeCategory, products],
  );

  return (
    <section id="catalog" className="px-[1%] max-[600px]:px-0" aria-label="Каталог продуктов">
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
      {isLoading ? (
        <div className="grid grid-cols-4 gap-9 max-[1439px]:grid-cols-3 max-[1099px]:grid-cols-2 max-[699px]:grid-cols-1" aria-label="Загрузка каталога">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-[480px] animate-pulse rounded-[22px] bg-[#fcfbf8]" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[22px] bg-[#fcfbf8] px-6 py-10 text-center">
          <p className="text-[#5b6165]">Не удалось загрузить товары. Проверьте подключение и попробуйте ещё раз.</p>
          <button className="mt-5 cursor-pointer rounded-full bg-[#151a1c] px-5 py-3 text-white" type="button" onClick={reload}>
            Повторить
          </button>
        </div>
      ) : visibleProducts.length ? (
        <Swiper
          key={activeCategory}
          slidesPerView={1}
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
      ) : (
        <p className="rounded-[22px] bg-[#fcfbf8] px-6 py-10 text-center text-[#5b6165]">В этой категории пока нет товаров.</p>
      )}
    </section>
  );
}
