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

// Galleries come from WordPress as HTML, so they are enhanced after render: drag to scroll,
// starting with the middle image centred so the outer ones bleed off both edges (as in the design).
export function BlogGalleries() {
  useEffect(() => {
    const galleries = document.querySelectorAll<HTMLElement>(".blog-content > .wp-block-gallery");
    const cleanups = Array.from(galleries, (gallery) => {
      const images = gallery.querySelectorAll<HTMLElement>(":scope > figure");
      const middle = images[Math.floor(images.length / 2)];
      if (middle) {
        gallery.scrollLeft = middle.offsetLeft + middle.offsetWidth / 2 - gallery.clientWidth / 2;
      }
      return enableDragScroll(gallery);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
