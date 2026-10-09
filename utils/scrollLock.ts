/**
 * Locks page scrolling while a modal is open. Lenis smooth scroll (ScrollMotion) listens to these
 * events, because `overflow: hidden` alone does not stop it from scrolling on wheel.
 */
export const SCROLL_LOCK_EVENT = "aminoclub:scroll-lock";

/**
 * The page keeps a slot for its scrollbar (`scrollbar-gutter: stable` in globals.css), but fixed overlays stop
 * short of it: a dimmed backdrop would leave a strip there and a modal's own scrollbar would sit next to it.
 * So while locked the slot is dropped and the page is padded by its width instead — nothing shifts, overlays span
 * the whole window and their scrollbar takes the page scrollbar's place. Fixed page elements (the stuck header)
 * keep clear of that padding with `--scroll-lock-gap`.
 */
export function setScrollLocked(locked: boolean) {
  const root = document.documentElement;
  if (locked && root.style.overflow !== "hidden") {
    // Not `clientWidth`: with a reserved but empty slot Chrome reports the full window width there.
    const gap = Math.max(0, window.innerWidth - root.getBoundingClientRect().width);
    root.style.setProperty("--scroll-lock-gap", `${gap}px`);
    root.style.paddingRight = `${gap}px`;
    root.style.scrollbarGutter = "auto";
    root.style.overflow = "hidden";
  } else if (!locked) {
    root.style.removeProperty("--scroll-lock-gap");
    root.style.paddingRight = "";
    root.style.scrollbarGutter = "";
    root.style.overflow = "";
  }
  window.dispatchEvent(new CustomEvent<boolean>(SCROLL_LOCK_EVENT, { detail: locked }));
}
