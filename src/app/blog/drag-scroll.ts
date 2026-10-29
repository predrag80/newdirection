// Mouse drag scrolling for a horizontal overflow element (touch scrolls natively).
// Adds "is-dragging" while dragging; returns a cleanup function.
export function enableDragScroll(element: HTMLElement) {
  let startX = 0;
  let startScrollLeft = 0;
  let activePointerId: number | null = null;
  let isDragging = false;

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0 || event.pointerType !== "mouse") return;

    activePointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = element.scrollLeft;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (activePointerId !== event.pointerId) return;

    const dragDistance = event.clientX - startX;
    if (!isDragging && Math.abs(dragDistance) < 8) return;

    if (!isDragging) {
      isDragging = true;
      element.classList.add("is-dragging");
      element.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    element.scrollLeft = startScrollLeft - dragDistance;
  };

  const endDrag = (event: PointerEvent) => {
    isDragging = false;
    activePointerId = null;
    element.classList.remove("is-dragging");
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", endDrag);
  element.addEventListener("pointercancel", endDrag);
  element.addEventListener("lostpointercapture", endDrag);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", endDrag);
    element.removeEventListener("pointercancel", endDrag);
    element.removeEventListener("lostpointercapture", endDrag);
  };
}
