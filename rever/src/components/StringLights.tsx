"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Festoon string lights, the light of every Rever garden event, switching on bulb by bulb.
 * The wire stretches with the width; the bulbs are fixed-size elements placed along it,
 * so they stay round at any screen size and their glow is never clipped.
 */
const SWAGS = [
  [0, 340, 34],
  [340, 660, 26],
  [660, 1000, 36],
] as const;
const TOP = 6;
const H = 80;

const bulbs = SWAGS.flatMap(([x0, x1, sag]) =>
  [0.14, 0.32, 0.5, 0.68, 0.86].map((t) => ({ x: x0 + (x1 - x0) * t, y: TOP + 4 * sag * t * (1 - t) })),
);
const wire = SWAGS.map(([x0, x1, sag]) => `M${x0} ${TOP} Q${(x0 + x1) / 2} ${TOP + 2 * sag} ${x1} ${TOP}`).join(" ");

/** onMount: switch on right after load (the opening); otherwise when scrolled into view. */
export function StringLights({ className = "", dark = false, onMount = false }: { className?: string; dark?: boolean; onMount?: boolean }) {
  const reduce = useReducedMotion();
  const trigger = reduce ? { initial: "on", animate: "on" } : onMount ? { initial: "off", animate: "on" } : { initial: "off", whileInView: "on" };
  const start = onMount ? 0.6 : 0.15;
  return (
    <motion.div aria-hidden="true" className={`relative h-[64px] w-full md:h-[88px] ${className}`} {...trigger} viewport={{ once: true, margin: "0px 0px -15% 0px" }}>
      <svg viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={wire} fill="none" stroke={dark ? "rgba(246,240,230,.35)" : "rgba(42,33,24,.35)"} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span key={i} className="absolute -translate-x-1/2" style={{ left: `${b.x / 10}%`, top: `${(b.y / H) * 100}%` }}>
          <motion.span
            className="bulb-halo absolute left-1/2 top-[10px] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-16 md:w-16"
            variants={{ off: { opacity: 0, scale: 0.4 }, on: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.6, delay: start + i * 0.07, ease: "easeOut" }}
          />
          <span className={`relative block h-[4px] w-[5px] rounded-[1px] ${dark ? "bg-[#6b6155]" : "bg-[#5a4c3c]"}`} />
          <motion.span
            className="relative block h-[11px] w-[9px] rounded-[45%_45%_50%_50%]"
            variants={{ off: { backgroundColor: dark ? "#4a4038" : "#d8cbb6" }, on: { backgroundColor: "#fff1d6" } }}
            transition={{ duration: 0.3, delay: start + i * 0.07 }}
          />
        </span>
      ))}
    </motion.div>
  );
}
