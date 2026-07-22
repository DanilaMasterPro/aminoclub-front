"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";

const fadeUpSelector = "[data-fade-up]";

export default function ScrollMotion() {
  useEffect(() => {
    const elements = new Set<HTMLElement>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      gsap.set(gsap.utils.toArray<HTMLElement>(fadeUpSelector), { clearProps: "all" });
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      smoothWheel: true,
      syncTouch: false,
    });
    const updateLenis = (time: number) => lenis.raf(time * 1000);
    const scrollToAnchor = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -16 });
      window.history.pushState(null, "", href);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: Number(element.dataset.fadeUpDelay ?? 0),
            ease: "power3.out",
            onComplete: () => gsap.set(element, { clearProps: "willChange" }),
          });
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    const prepareElement = (element: HTMLElement) => {
      if (element.dataset.fadeUpReady || element.offsetParent === null) return;

      element.dataset.fadeUpReady = "true";
      elements.add(element);
      gsap.set(element, { autoAlpha: 0, y: 32, willChange: "transform, opacity" });
      observer.observe(element);
    };
    const prepareElements = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(fadeUpSelector)) prepareElement(root);
      root.querySelectorAll<HTMLElement>(fadeUpSelector).forEach(prepareElement);
    };
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) prepareElements(node);
        });
      });
    });

    prepareElements(document);
    mutations.observe(document.body, { childList: true, subtree: true });
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener("click", scrollToAnchor);

    return () => {
      document.removeEventListener("click", scrollToAnchor);
      gsap.ticker.remove(updateLenis);
      mutations.disconnect();
      observer.disconnect();
      lenis.destroy();
      elements.forEach((element) => {
        delete element.dataset.fadeUpReady;
        gsap.killTweensOf(element);
        gsap.set(element, { clearProps: "opacity,visibility,transform,willChange" });
      });
    };
  }, []);

  return null;
}
