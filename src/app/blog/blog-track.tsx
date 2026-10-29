"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { enableDragScroll } from "./drag-scroll";

// Horizontal card row: native scroll on touch, drag to scroll with the mouse
// (same behaviour as the project showcase track).
export function BlogTrack({ children, label }: { children: ReactNode; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    return enableDragScroll(track);
  }, []);

  return (
    <div className="blog-track" ref={trackRef} role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}

// In the design the middle gallery image starts at x=247 of the 1372px frame.
const GALLERY_MIDDLE_START = 247 / 1372;

// Galleries come from WordPress as HTML, so they are enhanced after render: drag to scroll.
// On desktop they start where the design does: the middle image at the same share of the width,
// the previous one peeking in from the left. On narrow screens they start at the first image.
export function BlogGalleries() {
  useEffect(() => {
    const galleries = document.querySelectorAll<HTMLElement>(".blog-content > .wp-block-gallery");
    const isDesktop = window.matchMedia("(min-width: 901px)").matches;
    const cleanups = Array.from(galleries, (gallery) => {
      const images = gallery.querySelectorAll<HTMLElement>(":scope > figure");
      const middle = images[Math.floor(images.length / 2)];
      if (isDesktop && middle) {
        const middleLeft =
          middle.getBoundingClientRect().left - gallery.getBoundingClientRect().left + gallery.scrollLeft;
        gallery.scrollLeft = middleLeft - gallery.clientWidth * GALLERY_MIDDLE_START;
      }
      return enableDragScroll(gallery);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
