"use client";

import Image from "next/image";
import { useState, type RefObject } from "react";
import { resolveProductImageUrl } from "@/api/catalog";
import { resolveMediaUrl } from "@/api/media";
import type { CatalogProduct } from "@/api/types";
import { productPhoto, productVideo } from "@/utils/productMedia";

type ProductCardMediaProps = {
  product: CatalogProduct;
  videoRef: RefObject<HTMLVideoElement | null>;
};

/**
 * Square product preview. With a video the first frame is shown at rest (`#t=0.001` makes Safari
 * render it with preload="metadata"); the card plays it on hover. The photo stays underneath until
 * the frame is ready, so a slow network still shows something.
 */
export default function ProductCardMedia({ product, videoRef }: ProductCardMediaProps) {
  const image = productPhoto(product);
  const video = productVideo(product);
  const [isVideoReady, setIsVideoReady] = useState(false);

  return (
    <>
      {image ? (
        <Image
          className="object-contain transition duration-500 hover:scale-[1.025]"
          src={resolveProductImageUrl(image.url)}
          alt={image.alt || product.title}
          fill
          sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 25vw"
        />
      ) : (
        <span className="flex h-full items-center justify-center px-5 text-center text-sm text-[#7a7f81]">Изображение скоро появится</span>
      )}
      {video && (
        <video
          ref={videoRef}
          src={`${resolveMediaUrl(video.url)}#t=0.001`}
          className={`absolute inset-0 size-full object-contain transition-opacity duration-300 ${isVideoReady ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedData={() => setIsVideoReady(true)}
        />
      )}
    </>
  );
}
