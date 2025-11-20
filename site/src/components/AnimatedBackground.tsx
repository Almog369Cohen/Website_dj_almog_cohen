"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function AnimatedBackground() {
  const particles = useMemo(() => {
    const rnd = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 20 }).map((_, i) => {
      const w = rnd(i + 1) * 4 + 2;
      const h = rnd(i + 101) * 4 + 2;
      const leftPct = rnd(i + 201) * 100;
      const topPct = rnd(i + 301) * 100;
      const duration = rnd(i + 401) * 3 + 2;
      const delay = rnd(i + 501) * 2;
      return { w, h, leftPct, topPct, duration, delay };
    });
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(5, 156, 192, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(3, 178, 140, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(5, 156, 192, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(5, 156, 192, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: p.w,
            height: p.h,
            left: `${p.leftPct}%`,
            top: `${p.topPct}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sound Waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-2 border-brand-blue/20 rounded-full"
            style={{
              width: 150 + i * 100,
              height: 150 + i * 100,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
