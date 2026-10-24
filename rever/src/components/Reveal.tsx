"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Light reveal: opacity and a short rise, no blur (blur is costly on phones and leaves blank areas if JS is slow). */
export function Reveal({ delay = 0, y = 24, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.1, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-3 text-[13px] font-medium tracking-[0.04em] text-gold">
      <span className="h-px w-10 bg-[#b08d57]/60" />
      {children}
    </div>
  );
}
