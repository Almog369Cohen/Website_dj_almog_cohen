"use client";

import { motion } from "framer-motion";
import Image, { type ImageProps } from "next/image";

/** A photo that is "lit" when it enters: a warm light sweeps across once, with a coloured glow beneath. */
export function LitImage({ glow = "rgba(242,184,102,.55)", className = "", ...img }: ImageProps & { glow?: string }) {
  return (
    <div className={`lit relative overflow-hidden ${className}`} style={{ "--glow": glow } as React.CSSProperties}>
      <Image {...img} alt={img.alt} className="object-cover" />
      <motion.span
        aria-hidden="true"
        className="light-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/2"
        initial={{ x: "0%" }}
        whileInView={{ x: "320%" }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      />
    </div>
  );
}
