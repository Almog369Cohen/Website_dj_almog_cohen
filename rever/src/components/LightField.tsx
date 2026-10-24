"use client";

import { useEffect, useState } from "react";

/**
 * The page's light, behind every light section. The scene of the section that has
 * reached 60% of the screen height spreads in from the top, like light spilling
 * from the string lights. Colours come from Rever's own photos. Dark sections
 * (the opening and the dance floor) carry their own opaque background, so dark
 * text can never land on a dark light.
 * Position is measured on scroll, not with IntersectionObserver margins, which
 * browsers ignore inside cross-origin iframes (previews, embeds).
 */
const SCENES = ["night", "dawn", "day", "golden"] as const;
type Scene = (typeof SCENES)[number];

export function LightField() {
  const [[scene, prev], setScenes] = useState<[Scene, Scene]>(["night", "night"]);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.6;
      let next: Scene = "night";
      for (const el of els) if (el.getBoundingClientRect().top < line) next = el.dataset.scene as Scene;
      setScenes(([cur, old]) => (cur === next ? [cur, old] : [next, cur]));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
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
