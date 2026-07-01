"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function useProjectRouteTransition() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}

export function useDeferredProjectNext() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isDeferred, setIsDeferred] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("defer-project-next") === "1"
  );

  useEffect(() => {
    if (!isDeferred) return;

    const section = sectionRef.current;
    if (!section) return;

    let hasStartedFromTop = window.scrollY < 200;

    const reveal = () => {
      window.sessionStorage.removeItem("defer-project-next");
      setIsDeferred(false);
    };

    const handleScroll = () => {
      if (window.scrollY < 200) {
        hasStartedFromTop = true;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (hasStartedFromTop && entry.isIntersecting) {
          reveal();
        }
      },
      { rootMargin: "0px 0px 35% 0px", threshold: 0.01 }
    );

    window.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(section);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isDeferred]);

  return {
    isDeferredProjectNext: isDeferred,
    projectNextRef: sectionRef
  };
}
