"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to a container ref.
 * All children with .reveal, .reveal-stagger, .reveal-scale, or .reveal-pop
 * get the .revealed class when they enter the viewport.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(
      ".reveal, .reveal-stagger, .reveal-scale, .reveal-pop"
    );

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
