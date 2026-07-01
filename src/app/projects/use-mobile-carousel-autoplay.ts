"use client";

import { type RefObject, useEffect } from "react";

export function useMobileCarouselAutoplay(
  trackRef: RefObject<HTMLElement | null>,
  intervalMs = 4000
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mobileQuery = window.matchMedia("(max-width: 600px)");
    let interval: number | undefined;
    let isPaused = false;

    const clearAutoplay = () => {
      if (interval === undefined) return;

      window.clearInterval(interval);
      interval = undefined;
    };

    const advance = () => {
      if (
        !mobileQuery.matches ||
        document.hidden ||
        isPaused ||
        track.scrollWidth <= track.clientWidth + 2
      ) {
        return;
      }

      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      const isAtEnd = track.scrollLeft >= maxScrollLeft - 12;

      track.scrollTo({
        left: isAtEnd ? 0 : Math.min(track.scrollLeft + track.clientWidth * 0.86, maxScrollLeft),
        behavior: "smooth"
      });
    };

    const startAutoplay = () => {
      clearAutoplay();
      if (mobileQuery.matches) {
        interval = window.setInterval(advance, intervalMs);
      }
    };

    const pauseAutoplay = () => {
      isPaused = true;
    };

    const resumeAutoplay = () => {
      window.setTimeout(() => {
        isPaused = false;
      }, intervalMs);
    };

    startAutoplay();
    mobileQuery.addEventListener("change", startAutoplay);
    track.addEventListener("pointerdown", pauseAutoplay);
    track.addEventListener("pointerup", resumeAutoplay);
    track.addEventListener("pointercancel", resumeAutoplay);

    return () => {
      clearAutoplay();
      mobileQuery.removeEventListener("change", startAutoplay);
      track.removeEventListener("pointerdown", pauseAutoplay);
      track.removeEventListener("pointerup", resumeAutoplay);
      track.removeEventListener("pointercancel", resumeAutoplay);
    };
  }, [intervalMs, trackRef]);
}
