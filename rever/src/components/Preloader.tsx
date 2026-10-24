"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
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
          <motion.div initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.1, 1] }}>
            <Logo className="h-44 md:h-60" priority />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
