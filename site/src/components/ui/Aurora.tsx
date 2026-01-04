"use client";

import { motion } from "framer-motion";

interface AuroraProps {
  className?: string;
  colors?: string[];
  speed?: number;
  blur?: number;
  opacity?: number;
}

export function Aurora({
  className = "",
  colors = ["#059cc0", "#03b28c", "#059cc0"],
  speed = 10,
  blur = 100,
  opacity = 0.4,
}: AuroraProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Aurora Layer 1 */}
      <motion.div
        animate={{
          x: ["-20%", "20%", "-20%"],
          y: ["-10%", "10%", "-10%"],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%]"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${colors[0]}40 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      />

      {/* Aurora Layer 2 */}
      <motion.div
        animate={{
          x: ["20%", "-20%", "20%"],
          y: ["10%", "-10%", "10%"],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: speed * 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%]"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, ${colors[1]}40 0%, transparent 50%)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      />

      {/* Aurora Layer 3 - Subtle accent */}
      <motion.div
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["5%", "-5%", "5%"],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: speed * 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/4 left-1/4 w-[100%] h-[100%]"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${colors[2]}30 0%, transparent 40%)`,
          filter: `blur(${blur * 1.2}px)`,
          opacity: opacity * 0.7,
        }}
      />

      {/* Grain overlay for texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export default Aurora;
