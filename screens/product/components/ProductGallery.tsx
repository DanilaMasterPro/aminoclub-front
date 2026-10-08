"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { resolveProductImageUrl } from "@/api/catalog";
import { isVideoUrl, resolveMediaUrl } from "@/api/media";
import type { CatalogProduct } from "@/api/types";
import { useProductGallery } from "../hooks/useProductGallery";

/** Plays muted and looped only while its slide is active, so hidden slides do not download. */
function GalleryVideo({ url, isActive }: { url: string; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) void video.play().catch(() => undefined);
    else video.pause();
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={`${resolveMediaUrl(url)}#t=0.001`}
      className="absolute inset-0 size-full object-contain"
      muted
      loop
      playsInline
      controls
      preload="metadata"
    />
  );
}

export default function ProductGallery({ product }: { product: CatalogProduct }) {
  const { activeIndex, setActiveIndex, setSwiper, goTo } = useProductGallery();
  const images = product.images.length ? product.images : [{ id: "empty", url: "/images/products/light-whey-chocolate.jpg", alt: product.title, sortOrder: 0 }];

  return (
    // Desktop: the gallery sticks while the description scrolls and stops at the end of the product section
    // (the grid row is its containing block). The square is capped by the viewport height so it always fits.
    <div className="min-w-0 self-start min-[1001px]:sticky min-[1001px]:top-8">
      <div className="mx-auto w-full max-w-[min(100%,calc(100svh-220px))] max-[1000px]:max-w-[720px]">
      <p className="mb-5 pl-4 text-xs text-[#646a69]">Артикул: {product.sku || product.id.slice(-8).toUpperCase()}</p>
      <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} onSwiper={setSwiper} onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} className="overflow-hidden rounded-[20px] bg-white">
        {images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <div className="relative aspect-square">
              {isVideoUrl(image.url) ? (
                <GalleryVideo url={image.url} isActive={activeIndex === index} />
              ) : (
                <Image src={resolveProductImageUrl(image.url)} alt={image.alt || product.title} fill priority={index === 0} className="object-contain" sizes="(max-width: 1000px) 94vw, 52vw" />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button type="button" key={image.id} onClick={() => goTo(index)} aria-label={isVideoUrl(image.url) ? "Видео" : `Фото ${index + 1}`} className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${activeIndex === index ? "border-[#009d0a]" : "border-transparent"}`}>
              {isVideoUrl(image.url) ? (
                <>
                  <video src={`${resolveMediaUrl(image.url)}#t=0.001`} className="size-full object-contain" muted playsInline preload="metadata" aria-hidden="true" />
                  <span className="absolute inset-0 grid place-items-center text-xl text-white [text-shadow:0_1px_6px_rgba(0,0,0,.55)]" aria-hidden="true">▶</span>
                </>
              ) : (
                <Image src={resolveProductImageUrl(image.url)} alt="" fill className="object-contain" />
              )}
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
