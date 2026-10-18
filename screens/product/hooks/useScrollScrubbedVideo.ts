"use client";

import { useEffect, type RefObject } from "react";

/** Below this much sticky travel (a short description) the desktop mapping falls back to the mobile one. */
const MIN_STICKY_TRAVEL = 240;

/**
 * Plays the product video by page scroll instead of time: the frame follows the scroll position, forwards
 * and backwards. Desktop — over the whole time the gallery stays pinned while the description scrolls past;
 * phones (gallery not sticky) — while the gallery scrolls up under the header, so part of it is seen only
 * as the gallery leaves the screen. Smoothed with a short ease so wheel steps do not jump frames.
 * Needs a video encoded for seeking (backend storeScrubVideo).
 */
export function useScrollScrubbedVideo(videoRef: RefObject<HTMLVideoElement | null>, trackRef: RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!isActive || !video || !track) return;

    // Scroll position (window.scrollY) at which the video reaches its last frame.
    const endScroll = () => {
      const style = getComputedStyle(track);
      const scrollY = window.scrollY;
      if (style.position === "sticky" && track.parentElement) {
        const stickyTop = Number.parseFloat(style.top) || 0;
        const stickyEnd = track.parentElement.getBoundingClientRect().bottom + scrollY - track.offsetHeight - stickyTop;
        if (stickyEnd >= MIN_STICKY_TRAVEL) return stickyEnd;
      }
      const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sticky-header-h")) || 0;
      return track.getBoundingClientRect().bottom + scrollY - header;
    };

    let isVisible = true;
    let shown = -1;
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!isVisible || !video.duration || video.seeking) return;
      const end = endScroll();
      const progress = end > 0 ? Math.min(1, Math.max(0, window.scrollY / end)) : 0;
      const target = progress * Math.max(0, video.duration - 0.04);
      shown = shown < 0 ? target : shown + (target - shown) * 0.25;
      if (Math.abs(video.currentTime - shown) > 1 / 90) video.currentTime = shown;
    };

    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(video);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [isActive, trackRef, videoRef]);
}
