"use client";

import { motion } from "framer-motion";

interface VinylSpinnerProps {
  size?: number;
  spinning?: boolean;
  className?: string;
}

export function VinylSpinner({ size = 80, spinning = true, className = "" }: VinylSpinnerProps) {
  const r = size / 2;
  const grooveCount = 6;

  return (
    <motion.div
      animate={spinning ? { rotate: 360 } : {}}
      transition={spinning ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
      className={className}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* Outer ring */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1.5" />

        {/* Vinyl body */}
        <circle cx="50" cy="50" r="46" fill="#12101a" />

        {/* Grooves */}
        {Array.from({ length: grooveCount }).map((_, i) => {
          const grooveR = 18 + i * 4.5;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={grooveR}
              fill="none"
              stroke="rgba(201,168,76,0.06)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Gold gradient ring — label area */}
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#e8c87a" />
          </linearGradient>
          <radialGradient id="label-grad">
            <stop offset="0%" stopColor="#1a1520" />
            <stop offset="70%" stopColor="#12101a" />
            <stop offset="100%" stopColor="#0d0b14" />
          </radialGradient>
        </defs>

        {/* Label circle */}
        <circle cx="50" cy="50" r="15" fill="url(#label-grad)" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="url(#gold-grad)" strokeWidth="1" />

        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="url(#gold-grad)" />

        {/* Subtle highlight reflection */}
        <ellipse
          cx="38"
          cy="38"
          rx="20"
          ry="12"
          fill="rgba(255,255,255,0.03)"
          transform="rotate(-30 38 38)"
        />
      </svg>
    </motion.div>
  );
}
