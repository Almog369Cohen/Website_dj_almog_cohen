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
  const [visible, setVisible] = useState(() => shuffleArray(logos).slice(0, 3));
  const [tick, setTick] = useState(0);

  const pickNext = useCallback(() => {
    setVisible((prev) => {
      const prevAlts = new Set(prev.map((l) => l.alt));
      const pool = logos.filter((l) => !prevAlts.has(l.alt));
      const shuffled = shuffleArray(pool);
      return shuffled.slice(0, 3);
    });
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(pickNext, 4000);
    return () => clearInterval(interval);
  }, [pickNext]);

  return (
    <div className="flex items-center justify-center h-14 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={tick}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex items-center justify-center gap-8 md:gap-14"
        >
          {visible.map((logo, i) => (
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={32}
                className="object-contain opacity-50 hover:opacity-90 transition-opacity duration-300"
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
