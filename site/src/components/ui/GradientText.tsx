"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface GradientTextProps {
  text: string;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
  delay?: number;
}

export function GradientText({
  text,
  className = "",
  from = "#059cc0",
  via,
  to = "#03b28c",
  animate = true,
  delay = 0,
}: GradientTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const gradientStyle = {
    backgroundImage: via
      ? `linear-gradient(90deg, ${from}, ${via}, ${to})`
      : `linear-gradient(90deg, ${from}, ${to})`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    backgroundSize: animate ? "200% 100%" : "100% 100%",
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      style={gradientStyle}
      initial={{ opacity: 0, y: 20, backgroundPosition: "100% 0" }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              backgroundPosition: animate ? ["100% 0", "0% 0"] : "0% 0",
            }
          : {}
      }
      transition={{
        duration: 0.8,
        delay,
        backgroundPosition: {
          duration: 3,
          repeat: animate ? Infinity : 0,
          repeatType: "reverse",
          ease: "linear",
        },
      }}
    >
      {text}
    </motion.span>
  );
}

export default GradientText;
