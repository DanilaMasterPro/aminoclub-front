"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { resolveProductImageUrl } from "@/api/catalog";
import type { CatalogProduct } from "@/api/types";
import { useProductGallery } from "../hooks/useProductGallery";

export default function ProductGallery({ product }: { product: CatalogProduct }) {
  const { activeIndex, setActiveIndex, setSwiper, goTo } = useProductGallery();
  const images = product.images.length ? product.images : [{ id: "empty", url: "/images/products/light-whey-chocolate.jpg", alt: product.title, sortOrder: 0 }];

  return (
    <div className="min-w-0">
      <p className="mb-5 pl-4 text-xs text-[#646a69]">Артикул: {product.sku || product.id.slice(-8).toUpperCase()}</p>
      <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} onSwiper={setSwiper} onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} className="overflow-hidden rounded-[20px] bg-[#fcfbf8]">
        {images.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative aspect-[1.38/1] min-h-[360px] max-[600px]:min-h-[300px]">
              <Image src={resolveProductImageUrl(image.url)} alt={image.alt || product.title} fill priority className="object-cover" sizes="(max-width: 1000px) 94vw, 52vw" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto">{images.map((image, index) => <button type="button" key={image.id} onClick={() => goTo(index)} className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${activeIndex === index ? "border-[#009d0a]" : "border-transparent"}`}><Image src={resolveProductImageUrl(image.url)} alt="" fill className="object-cover" /></button>)}</div>}
    </div>
  );
}
