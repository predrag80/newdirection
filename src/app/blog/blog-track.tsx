"use client";

import { type ReactNode, useEffect, useRef } from "react";

// Horizontal card row: native scroll on touch, drag to scroll with the mouse
// (same behaviour as the project showcase track).
export function BlogTrack({ children, label }: { children: ReactNode; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let startX = 0;
    let startScrollLeft = 0;
    let activePointerId: number | null = null;
    let isDragging = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.pointerType !== "mouse") return;

      activePointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;

      const dragDistance = event.clientX - startX;
      if (!isDragging && Math.abs(dragDistance) < 8) return;

      if (!isDragging) {
        isDragging = true;
        track.classList.add("is-dragging");
        track.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      track.scrollLeft = startScrollLeft - dragDistance;
    };

    const endDrag = (event: PointerEvent) => {
      isDragging = false;
      activePointerId = null;
      track.classList.remove("is-dragging");
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("lostpointercapture", endDrag);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("lostpointercapture", endDrag);
    };
  }, []);

  return (
    <div className="blog-track" ref={trackRef} role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
