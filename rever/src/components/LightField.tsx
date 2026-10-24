"use client";

import { useEffect, useState } from "react";

/**
 * The page's light, behind every light section. When a section reaches the middle
 * of the screen its scene fades in over the previous one. Colours come from Rever's own photos. Dark sections
 * (the opening and the dance floor) carry their own opaque background, so dark
 * text can never land on a dark light.
 * Position is measured on scroll, not with IntersectionObserver margins, which
 * browsers ignore inside cross-origin iframes (previews, embeds).
 */
// Light scenes only. Dark sections paint their own background, so a scene change is
// always light to light and dark text can never meet a dark layer, even after a jump.
const SCENES = ["dawn", "day", "golden"] as const;
type Scene = (typeof SCENES)[number];

export function LightField() {
  const [[scene, prev], setScenes] = useState<[Scene, Scene]>(["dawn", "dawn"]);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    let raf = 0;
    const measure = () => {
      raf = 0;
      // Two lines (52% and 68% of the screen) must agree before the light changes, so
      // hovering around a section boundary does not flicker it back and forth.
      const pick = (line: number) => {
        let s: Scene = "dawn";
        for (const el of els) if (el.getBoundingClientRect().top < line) s = el.dataset.scene as Scene;
        return s;
      };
      const next = pick(window.innerHeight * 0.52);
      if (next !== pick(window.innerHeight * 0.68)) return;
      setScenes(([cur, old]) => (cur === next ? [cur, old] : [next, cur]));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    window.addEventListener("load", onScroll);
    return () => {
      window.removeEventListener("hashchange", onScroll);
      window.removeEventListener("load", onScroll);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[100lvh] overflow-hidden">
      {SCENES.map((s) => (
        <div
          key={s}
          className={`scene scene-${s} ${s === scene && s !== prev ? "scene-in" : ""}`}
          style={{ visibility: s === scene || s === prev ? "visible" : "hidden", zIndex: s === scene ? 2 : 1 }}
        >
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>
      ))}
    </div>
  );
}
