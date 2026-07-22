"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from "@/components/Button";
import { products, type Product } from "@/mock/products";

type Category = "all" | Product["category"];

const tabs: Array<{ id: Category; label: string }> = [
  { id: "all", label: "Все" },
  { id: "proteins", label: "Протеины" },
  { id: "amino-acids", label: "Аминокислоты" },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const visibleProducts = useMemo(
    () => activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  return (
    <section id="catalog" className="px-[1%]" aria-label="Каталог продуктов">
      <div className="mb-[58px] flex flex-wrap gap-3.5 max-[600px]:mb-[30px]" role="tablist" aria-label="Категории товаров">
        {tabs.map((tab) => {
          const isActive = tab.id === activeCategory;
          return (
            <button
              key={tab.id}
              className={`cursor-pointer rounded-full border-0 px-5 py-[11px] text-base transition-colors ${isActive ? "bg-[#151a1c] text-white" : "bg-[#f8f8f8] text-[#151a1c]"}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(tab.id)}
            >
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
        className="!overflow-hidden"
      >
        {visibleProducts.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <article className="flex h-full min-w-0 flex-col rounded-[22px] bg-[#fcfbf7] p-5">
              <div className="relative aspect-[390/274] overflow-hidden rounded-[15px] bg-[#f2f4ef]">
                <Image className="object-cover" src={product.image} alt={`${product.name}, вкус ${product.flavour}`} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 25vw" />
              </div>
              <h2 className="mt-[25px] mb-[14px] text-[21px] font-medium">{product.name}</h2>
              <p className="min-h-[54px] text-sm leading-[1.4] text-[#5b6165] max-[600px]:min-h-0">{product.description}</p>
              <strong className="my-6 text-[23px]">{product.price.toLocaleString("ru-RU")} ₽</strong>
              <div className="flex items-center gap-3.5">
                <Button className="w-[235px] shrink-0 px-3.5 text-[15px] max-[1280px]:min-w-[130px] max-[1280px]:flex-1 max-[1280px]:w-auto" label="В корзину" icon="cart" />
                <span className="flex items-center gap-[7px] text-xs leading-[1.15] text-[#202425]"><Image src="/icons/clock.svg" alt="" width={25} height={25} />Доставка от<br />{product.delivery}</span>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
