"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { resolveProductImageUrl } from "@/api/catalog";
import { isVideoUrl, resolveMediaUrl } from "@/api/media";
import type { CatalogProduct } from "@/api/types";
import Lightbox from "@/components/Lightbox";
import { SliderArrow, SliderDots } from "@/components/SliderControls";
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    // Desktop: the gallery sticks while the description scrolls and stops at the end of the product section
    // (the grid row is its containing block). The square is capped by the viewport height so it always fits.
    <div className="min-w-0 self-start min-[1001px]:sticky min-[1001px]:top-8">
      <div className="mx-auto w-full max-[1000px]:max-w-[720px]">
      <p className="mb-5 text-xs text-[#646a69]">Артикул: {product.sku || product.id.slice(-8).toUpperCase()}</p>
      <div className="relative">
      <Swiper
        onSwiper={setSwiper}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        // A click (not a drag) on a photo opens it full screen; on a video slide the click belongs to the player.
        onClick={(swiper, event) => { if (!(event.target instanceof HTMLVideoElement)) setLightboxIndex(swiper.activeIndex); }}
        className="overflow-hidden rounded-[20px] bg-white"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id}>
            <div className={`relative aspect-square ${isVideoUrl(image.url) ? "" : "cursor-zoom-in"}`}>
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
        <>
          <SliderArrow direction="prev" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} className="absolute top-1/2 left-4 z-10 -translate-y-1/2 max-[600px]:left-2" />
          <SliderArrow direction="next" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === images.length - 1} className="absolute top-1/2 right-4 z-10 -translate-y-1/2 max-[600px]:right-2" />
          {/* Hidden on a video slide: the player controls live at the bottom. */}
          {!isVideoUrl(images[activeIndex]?.url ?? "") && (
            <SliderDots count={images.length} active={activeIndex} onSelect={goTo} className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/85 px-3 py-2 shadow-[0_3px_15px_rgba(0,0,0,.06)] backdrop-blur" />
          )}
        </>
      )}
      </div>
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
      <Lightbox
        items={images.map((image) => ({ url: image.url, alt: image.alt || product.title }))}
        index={lightboxIndex}
        onIndexChange={(index) => {
          setLightboxIndex(index);
          if (index !== null) goTo(index);
        }}
      />
    </div>
  );
}
