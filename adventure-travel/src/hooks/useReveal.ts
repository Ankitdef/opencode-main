"use client";

import { useEffect, useRef } from "react";

export function useReveal(
  className: string = "reveal-up",
  options?: { threshold?: number; stagger?: number }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stagger = options?.stagger;
            if (stagger && el.children.length > 0) {
              Array.from(el.children).forEach((child, i) => {
                (child as HTMLElement).style.transitionDelay = `${i * stagger}s`;
              });
            }
            el.classList.add("revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [className, options?.threshold, options?.stagger]);

  return { ref, className };
}
