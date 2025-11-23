"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionTransitionProps {
  /** Current section background color */
  fromColor: string;
  /** Next section background color */
  toColor: string;
  /** Accent color for subtle highlights */
  accentColor?: string;
  /** Show flow arrow */
  showArrow?: boolean;
  /** Preview of next section (optional) */
  nextPreview?: ReactNode;
  /** Position: top or bottom */
  position?: "top" | "bottom";
}

export const SectionTransition = ({
  fromColor,
  toColor,
  accentColor,
  showArrow = true,
  nextPreview,
  position = "bottom",
}: SectionTransitionProps) => {
  const isTop = position === "top";

  return (
    <div
      className={`absolute inset-x-0 ${isTop ? "top-0" : "bottom-0"} pointer-events-none overflow-hidden`}
      style={{ height: "200px" }}
    >
      {/* Layer 1: Smooth Gradient Bridge */}
      <div
        className="absolute inset-0"
        style={{
          background: isTop
            ? `linear-gradient(180deg, 
                ${fromColor} 0%, 
                ${fromColor}f0 15%, 
                ${fromColor}80 40%, 
                ${toColor}40 70%, 
                ${toColor} 100%)`
            : `linear-gradient(0deg, 
                ${toColor} 0%, 
                ${toColor}f0 15%, 
                ${toColor}80 40%, 
                ${fromColor}40 70%, 
                ${fromColor} 100%)`,
        }}
      />

      {/* Layer 2: Subtle Accent Glow */}
      {accentColor && (
        <motion.div
          className="absolute inset-x-0"
          style={{
            height: "2px",
            top: isTop ? "auto" : "50%",
            bottom: isTop ? "50%" : "auto",
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${accentColor}40 50%, 
              transparent 100%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scaleX: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Layer 3: Flow Arrow (only on desktop) */}
      {showArrow && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 hidden md:block"
          style={{
            [isTop ? "top" : "bottom"]: "40%",
          }}
          initial={{ opacity: 0, y: isTop ? -10 : 10 }}
          whileInView={{ opacity: 0.25, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
            animate={{
              y: isTop ? [-4, 4, -4] : [4, -4, 4],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {isTop ? (
              <path d="M12 19V5M12 5l-7 7M12 5l7 7" />
            ) : (
              <path d="M12 5v14M12 19l7-7M12 19l-7-7" />
            )}
          </motion.svg>
        </motion.div>
      )}

      {/* Layer 4: Next Section Preview (ultra subtle) */}
      {nextPreview && (
        <motion.div
          className="absolute inset-0"
          style={{
            top: isTop ? "0" : "auto",
            bottom: isTop ? "auto" : "0",
            height: "120px",
          }}
          initial={{ opacity: 0, y: isTop ? -20 : 20 }}
          whileInView={{ opacity: 0.08, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 blur-2xl scale-110 opacity-50">
              {nextPreview}
            </div>
          </div>
        </motion.div>
      )}

      {/* Layer 5: Noise Texture for Depth */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
};
