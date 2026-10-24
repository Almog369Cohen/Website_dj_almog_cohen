"use client";

import { useEffect, useState } from "react";

/**
 * The page's light. Each section declares a scene (data-scene); the scene whose
 * section crosses the middle of the screen spreads in from the top, like light
 * spilling from the string lights. Colours come from Rever's own
 * photos: candle and string-light amber, blush, olive-tree sage, the lotus turquoise.
 * Only opacity and transform animate, so it stays smooth on phones.
 */
const SCENES = ["night", "dawn", "day", "party", "golden"] as const;
type Scene = (typeof SCENES)[number];

export function LightField() {
  // The previous scene stays fully lit underneath while the new one fades in over it,
  // so a change never dips through a dim, muddy mix of the two.
  const [[scene, prev], setScenes] = useState<[Scene, Scene]>(["night", "night"]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const next = (e.target as HTMLElement).dataset.scene as Scene;
          setScenes(([cur]) => (cur === next ? [cur, cur] : [next, cur]));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-scene]").forEach((el) => io.observe(el));
    return () => io.disconnect();
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
