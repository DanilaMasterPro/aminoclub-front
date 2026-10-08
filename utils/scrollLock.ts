/**
 * Locks page scrolling while a modal is open. Lenis smooth scroll (ScrollMotion) listens to these
 * events, because `overflow: hidden` alone does not stop it from scrolling on wheel.
 */
export const SCROLL_LOCK_EVENT = "aminoclub:scroll-lock";

export function setScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  window.dispatchEvent(new CustomEvent<boolean>(SCROLL_LOCK_EVENT, { detail: locked }));
}
