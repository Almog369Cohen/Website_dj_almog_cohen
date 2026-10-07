"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center" dir="ltr">
            <div className="flex overflow-hidden">
              {"REVER".split("").map((c, i) => (
                <motion.span
                  key={i}
                  className="font-display text-6xl font-bold tracking-[0.3em] text-gold-grad md:text-8xl"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.2, 0.7, 0.1, 1] }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="mt-6 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 260 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
