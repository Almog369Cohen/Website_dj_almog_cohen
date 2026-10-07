"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/content/site";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.2, 0.7, 0.1, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-bg-soft py-20" aria-label="Rever במספרים">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,178,111,0.12),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-5 md:grid-cols-4 md:px-8">
        {stats.map((s, i) => (
          <div key={s.label} className={`text-center ${i > 0 ? "md:border-r md:border-line" : ""}`}>
            <div className="font-display text-5xl font-bold text-gold-grad md:text-7xl">
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-sm text-ink-dim md:text-base">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
