"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const logos = [
  { src: "/assets/logos/april.jpeg", alt: "April" },
  { src: "/assets/logos/jerusalem.png", alt: "עיריית ירושלים" },
  { src: "/assets/logos/dhl.png", alt: "DHL" },
  { src: "/assets/logos/bana.svg", alt: "Bana" },
  { src: "/assets/logos/kiryat-ono.png", alt: "קריית אונו" },
  { src: "/assets/logos/ariel.jpeg", alt: "אריאל" },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function LogoCarousel() {
  const [slots, setSlots] = useState(() => shuffleArray(logos).slice(0, 3));

  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prev) => {
        const currentAlts = new Set(prev.map((l) => l.alt));
        const pool = logos.filter((l) => !currentAlts.has(l.alt));
        if (pool.length === 0) return prev;
        const replacement = pool[Math.floor(Math.random() * pool.length)];
        const slotIdx = Math.floor(Math.random() * prev.length);
        const next = [...prev];
        next[slotIdx] = replacement;
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-10 w-full gap-3 md:gap-6 px-4">
      {slots.map((logo, i) => (
        <div key={i} className="relative w-[72px] h-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white/90 rounded-md w-[72px] h-8 flex items-center justify-center overflow-hidden p-1">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={60}
                  height={22}
                  className="object-contain max-w-[60px] max-h-[22px]"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
