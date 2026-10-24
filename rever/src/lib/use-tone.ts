"use client";

import { useEffect, useState } from "react";

/**
 * Whether a dark section (the opening or the dance floor) sits at a given height of the screen.
 * Measured on scroll from section rects; IntersectionObserver margins are ignored inside
 * cross-origin iframes, which is how the site is previewed.
 */
export function useDarkAt(y: () => number) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const at = y();
      const hit = ["top", "night"].some((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return !!r && r.top <= at && r.bottom > at;
      });
      setDark(hit);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    window.addEventListener("hashchange", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      window.removeEventListener("hashchange", on);
    };
    // y is a positional getter that is stable in meaning; measuring once per mount is intended
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return dark;
}
