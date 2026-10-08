"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { isVideoUrl, resolveMediaUrl } from "@/api/media";
import { SliderArrow } from "@/components/SliderControls";
import { setScrollLocked } from "@/utils/scrollLock";

export type LightboxItem = { url: string; alt?: string | null; caption?: string | null };

type LightboxProps = {
  items: LightboxItem[];
  /** Index of the opened item; null keeps the lightbox closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

/**
 * Full-screen viewer for photos, videos and documents: arrows, ←/→ and Esc, click on the backdrop
 * closes. Rendered into <body> so no parent overflow or transform can clip it.
 */
export default function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null && items.length > 0;
  const current = isOpen ? items[Math.min(index, items.length - 1)] : null;
  const position = isOpen ? Math.min(index, items.length - 1) : 0;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    closeRef.current?.focus();
    return () => {
      setScrollLocked(false);
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onIndexChange(null);
      if (event.key === "ArrowLeft" && position > 0) onIndexChange(position - 1);
      if (event.key === "ArrowRight" && position < items.length - 1) onIndexChange(position + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, items.length, onIndexChange, position]);

  if (!current) return null;
  const src = resolveMediaUrl(current.url);
  const label = current.caption || current.alt || "Просмотр";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-lenis-prevent
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#15191a]/85 px-20 py-16 backdrop-blur-sm max-[700px]:px-3 max-[700px]:py-20"
      onClick={(event) => { if (event.target === event.currentTarget) onIndexChange(null); }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={() => onIndexChange(null)}
        aria-label="Закрыть"
        className="absolute top-5 right-5 grid size-12 cursor-pointer place-items-center rounded-full bg-white text-[#15191a] shadow-[0_3px_15px_rgba(0,0,0,.08)] transition hover:bg-[#009d0a] hover:text-white max-[600px]:size-10"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
          <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
        </svg>
      </button>

      <div className="relative h-full max-h-[calc(100svh-180px)] w-full max-w-[1200px]" onClick={(event) => { if (event.target === event.currentTarget) onIndexChange(null); }}>
        {isVideoUrl(current.url) ? (
          <video key={src} src={src} className="absolute inset-0 size-full object-contain" controls autoPlay muted loop playsInline />
        ) : (
          <Image key={src} src={src} alt={current.alt || current.caption || ""} fill sizes="90vw" loading="eager" className="object-contain" />
        )}
      </div>

      <p className="mt-4 text-center text-sm text-white/85">
        {current.caption && <span className="mr-3 text-white">{current.caption}</span>}
        {items.length > 1 && `${position + 1} / ${items.length}`}
      </p>

      {items.length > 1 && (
        <>
          <SliderArrow direction="prev" onClick={() => onIndexChange(position - 1)} disabled={position === 0} className="absolute top-1/2 left-5 -translate-y-1/2 max-[700px]:top-auto max-[700px]:bottom-5 max-[700px]:left-[calc(50%-52px)] max-[700px]:translate-y-0" />
          <SliderArrow direction="next" onClick={() => onIndexChange(position + 1)} disabled={position === items.length - 1} className="absolute top-1/2 right-5 -translate-y-1/2 max-[700px]:top-auto max-[700px]:right-[calc(50%-52px)] max-[700px]:bottom-5 max-[700px]:translate-y-0" />
        </>
      )}
    </div>,
    document.body,
  );
}
