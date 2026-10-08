"use client";

import { useCallback, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";

type SliderArrowProps = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

/** Round arrow in the site style (like the header cart/menu buttons); replaces Swiper's default arrows. */
export function SliderArrow({ direction, onClick, disabled = false, className = "" }: SliderArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Назад" : "Вперёд"}
      className={`grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-[#15191a] shadow-[0_3px_15px_rgba(0,0,0,.08)] transition duration-200 hover:bg-[#009d0a] hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-[#15191a] max-[600px]:size-10 ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={`size-5 ${direction === "next" ? "rotate-180" : ""}`}>
        <path d="m12.5 15-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

type SliderDotsProps = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  className?: string;
};

/** Small dots; the active one stretches into a green pill. */
export function SliderDots({ count, active, onSelect, className = "" }: SliderDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Слайд ${index + 1}`}
          aria-current={index === active}
          className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${index === active ? "w-6 bg-[#009d0a]" : "w-2 bg-[#15191a]/20 hover:bg-[#15191a]/40"}`}
        />
      ))}
    </div>
  );
}

/** Keeps arrow state in sync with a Swiper instance (start/end, nothing to scroll). */
export function useSliderControls() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [state, setState] = useState({ isBeginning: true, isEnd: true, isLocked: true });

  const sync = useCallback((instance: SwiperInstance) => {
    setState({ isBeginning: instance.isBeginning, isEnd: instance.isEnd, isLocked: instance.isLocked });
  }, []);

  const onSwiper = useCallback((instance: SwiperInstance) => {
    setSwiper(instance);
    sync(instance);
  }, [sync]);

  return {
    ...state,
    onSwiper,
    sync,
    prev: () => swiper?.slidePrev(),
    next: () => swiper?.slideNext(),
  };
}
