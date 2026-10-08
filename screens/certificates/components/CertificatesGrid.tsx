"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveMediaUrl } from "@/api/media";
import Lightbox from "@/components/Lightbox";

/** Portrait document thumbnails in rows; a click opens the full-size scan. */
export default function CertificatesGrid({ imageUrls }: { imageUrls: string[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!imageUrls.length) {
    return <p className="mt-14 rounded-[22px] bg-[#fcfbf8] px-6 py-10 text-center text-[#5b6165]">Сертификаты скоро появятся.</p>;
  }

  return (
    <>
      <div className="mt-14 grid grid-cols-5 gap-6 max-[1300px]:grid-cols-4 max-[1000px]:grid-cols-3 max-[700px]:grid-cols-2 max-[700px]:gap-3">
        {imageUrls.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            data-fade-up
            data-fade-up-delay={(index % 5) * 0.05}
            onClick={() => setOpenIndex(index)}
            aria-label={`Открыть сертификат ${index + 1}`}
            className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_3px_15px_rgba(0,0,0,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,.08)] max-[700px]:p-2"
          >
            <span className="relative block size-full">
              <Image src={resolveMediaUrl(url)} alt={`Сертификат ${index + 1}`} fill sizes="(max-width: 700px) 45vw, (max-width: 1300px) 25vw, 20vw" className="object-contain" />
            </span>
            <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-white text-[#15191a] opacity-0 shadow-[0_3px_15px_rgba(0,0,0,.08)] transition group-hover:opacity-100" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
                <circle cx="9" cy="9" r="5.5" />
                <path d="m13 13 4 4M9 6.5v5M6.5 9h5" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>
      <Lightbox items={imageUrls.map((url, index) => ({ url, alt: `Сертификат ${index + 1}` }))} index={openIndex} onIndexChange={setOpenIndex} />
    </>
  );
}
