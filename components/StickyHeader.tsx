"use client";

import { useEffect, useState } from "react";

// Hysteresis: stick once the big header has scrolled away, unstick only near the top, so it does not flicker.
const STICK_AFTER = 200;
const UNSTICK_BEFORE = 60;

/**
 * Site header frame. At the top it lies over the page (absolute, transparent); after scrolling down it becomes
 * a compact white bar fixed to the viewport. Its height is `--sticky-header-h` (globals.css): sticky blocks
 * (product gallery, cart summary) and anchor scrolling keep clear of it.
 */
export default function StickyHeader({ children }: { children: React.ReactNode }) {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const update = () => setIsStuck((stuck) => (stuck ? window.scrollY > UNSTICK_BEFORE : window.scrollY > STICK_AFTER));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-stuck={isStuck ? "" : undefined}
      className={`group flex items-center justify-between ${
        isStuck
          // Same horizontal offsets as the header inside <main> (page margin + header padding), centred above 1976px.
          ? "fixed top-0 right-(--scroll-lock-gap) left-0 z-50 h-(--sticky-header-h) animate-[header-in_.35s_ease-out] bg-white px-[max(86px,calc((100%_-_1920px)/2_+_58px))] shadow-[0_6px_24px_rgba(0,0,0,.06)] max-[1200px]:px-[68px] max-[600px]:px-[30px]"
          : "absolute top-0 left-0 z-[2] w-full p-[58px] max-[1200px]:p-10 max-[600px]:p-[18px]"
      }`}
    >
      {children}
    </header>
  );
}
