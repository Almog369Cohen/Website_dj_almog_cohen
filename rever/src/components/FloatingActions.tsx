"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

export function FloatingActions() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 600));

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שלחו לנו הודעה בוואטסאפ"
          className="glass-dark fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-[#d9b26f]"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
        >
          <WhatsAppIcon className="relative h-6 w-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

