"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Testimonials Section - המלצות מלקוחות
 * WhatsApp mockup screenshots
 */

const testimonialMockups = [
  {
    id: 1,
    name: "אוריאל & יעל",
    image: "/assets/testimonials/orielyaelmok.png",
    rotation: -3, // נוטה שמאלה
  },
  {
    id: 2,
    name: "שיראל & אופק",
    image: "/assets/testimonials/shirelofekmok.png",
    rotation: -1, // כמעט ישר
  },
  {
    id: 3,
    name: "הראל & אביב",
    image: "/assets/testimonials/Harelavivmok.png",
    rotation: 5, // נוטה ימינה
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) return;

    const tick = () => setActiveIndex((i) => (i + 1) % testimonialMockups.length);
    const interval = setInterval(() => {
      if (document.visibilityState !== "hidden") tick();
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-brand-green/5 to-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-brand-green text-sm font-medium tracking-wider uppercase mb-2 block">
            מה אומרים עליי
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            הלקוחות מדברים
          </h2>
        </motion.div>

        {/* Mockup Images - Horizontal scroll on mobile, overlapping stack on desktop */}
        <div className="relative">
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden -mx-4 px-4">
            <div className="relative w-full h-[80svh]">
              <motion.div
                key={testimonialMockups[activeIndex]?.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 60) {
                    setActiveIndex((i) => (i - 1 + testimonialMockups.length) % testimonialMockups.length);
                  }
                  if (info.offset.x < -60) {
                    setActiveIndex((i) => (i + 1) % testimonialMockups.length);
                  }
                }}
                className="absolute inset-0"
                style={{ transform: `rotate(${testimonialMockups[activeIndex]?.rotation ?? 0}deg)` }}
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  <Image
                    src={testimonialMockups[activeIndex]?.image}
                    alt={`המלצה מ${testimonialMockups[activeIndex]?.name}`}
                    fill
                    sizes="100vw"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </motion.div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-foreground-secondary text-sm font-medium">
                {testimonialMockups[activeIndex]?.name}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                {testimonialMockups.map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-label={`המלצה ${i + 1}`}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      i === activeIndex ? "bg-brand-green scale-110" : "bg-foreground/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Overlapping stack */}
          <div className="hidden md:flex justify-center items-center gap-0 py-8">
            {testimonialMockups.map((mockup, index) => (
              <motion.div
                key={mockup.id}
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: mockup.rotation }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                className="relative group"
                style={{ 
                  marginLeft: index === 0 ? 0 : "-60px",
                  zIndex: index === 1 ? 10 : 5 - Math.abs(index - 1),
                }}
              >
                {/* Glow on hover */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-green/30 to-brand-blue/30 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Image
                  src={mockup.image}
                  alt={`המלצה מ${mockup.name}`}
                  width={320}
                  height={640}
                  className="relative w-[280px] h-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:z-20"
                />
                
                {/* Name on hover */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-foreground text-sm font-medium whitespace-nowrap bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">{mockup.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground/5 border border-foreground/10">
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span className="text-foreground-secondary text-sm">500+ אירועים מוצלחים</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
