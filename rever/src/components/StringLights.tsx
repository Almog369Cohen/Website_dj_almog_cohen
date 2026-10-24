"use client";

import { motion } from "framer-motion";

/** Festoon string lights, the light of every Rever garden event, switching on bulb by bulb. */
const SWAGS = [
  [0, 340, 70],
  [340, 660, 55],
  [660, 1000, 75],
] as const;

const bulbs = SWAGS.flatMap(([x0, x1, sag]) =>
  [0.14, 0.32, 0.5, 0.68, 0.86].map((t) => ({ x: x0 + (x1 - x0) * t, y: 14 + 4 * sag * t * (1 - t) })),
);
const wire = SWAGS.map(([x0, x1, sag]) => `M${x0} 14 Q${(x0 + x1) / 2} ${14 + 2 * sag} ${x1} 14`).join(" ");

export function StringLights({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 1000 110"
      preserveAspectRatio="none"
      className={`block h-[64px] w-full md:h-[96px] ${className}`}
      aria-hidden="true"
      initial="off"
      whileInView="on"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      <defs>
        <radialGradient id="bulb-halo">
          <stop offset="0" stopColor="#ffd391" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#f2b866" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f2b866" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={wire} fill="none" stroke={dark ? "rgba(246,240,230,.35)" : "rgba(42,33,24,.35)"} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y + 7})`}>
          <motion.circle
            r="26"
            fill="url(#bulb-halo)"
            variants={{ off: { opacity: 0, scale: 0.4 }, on: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: "easeOut" }}
          />
          <motion.circle
            r="4.5"
            variants={{ off: { fill: dark ? "#5a5045" : "#c9bba5" }, on: { fill: "#fff1d6" } }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
          />
        </g>
      ))}
    </motion.svg>
  );
}
