"use client";

import { useMemo } from "react";

const PARTICLE_COUNT = 12;

export function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 18,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Floating golden particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-5%",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(5,156,192,${p.opacity}) 0%, transparent 70%)`,
            animation: `float-particle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}

      {/* Third ambient orb — rose accent, center */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: "350px",
          maxHeight: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)",
          animation: "float-orb 30s ease-in-out infinite",
        }}
      />
    </div>
  );
}
