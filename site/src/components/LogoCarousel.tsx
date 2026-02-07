"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const logos = [
  { src: "/assets/logos/april.jpeg", alt: "April" },
  { src: "/assets/logos/jerusalem.png", alt: "עיריית ירושלים" },
  { src: "/assets/logos/dhl.png", alt: "DHL" },
  { src: "/assets/logos/ort.png", alt: "ORT" },
  { src: "/assets/logos/bana.svg", alt: "Bana" },
  { src: "/assets/logos/kiryat-ono.png", alt: "קריית אונו" },
  { src: "/assets/logos/ariel.jpeg", alt: "אריאל" },
  { src: "/assets/logos/hamashbir.png", alt: "המשביר" },
  { src: "/assets/logos/ktm.svg", alt: "KTM" },
];

export default function LogoCarousel() {
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIdx((prev) => (prev + 3) % logos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visible = [
    logos[startIdx % logos.length],
    logos[(startIdx + 1) % logos.length],
    logos[(startIdx + 2) % logos.length],
  ];

  return (
    <div className="flex items-center justify-center h-12 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={startIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-10"
        >
          {visible.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={80}
              height={32}
              className="object-contain brightness-0 invert opacity-70"
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
