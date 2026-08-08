"use client";

import { useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";

export function useProductGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  return { activeIndex, setActiveIndex, setSwiper, goTo: (index: number) => swiper?.slideTo(index) };
}
