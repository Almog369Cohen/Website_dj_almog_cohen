"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";

const photos = [
  { src: "/assets/gallery/djavira/entrance.jpg", alt: "כניסה לחופה עם זיקוקים" },
  { src: "/photo almog cohen website/WhatsApp Image 2025-04-24 at 03.31.04 (4).jpeg", alt: "מסיבה עם אורות ניאון" },
  { src: "/assets/gallery/djavira/dj-almog.jpg", alt: "DJ אלמוג כהן" },
  { src: "/photo almog cohen website/WhatsApp Image 2025-04-24 at 03.31.08 (2).jpeg", alt: "אלמוג על עמדת Pioneer DJ" },
  { src: "/assets/gallery/djavira/traditional.jpg", alt: "מסיבה מסורתית" },
  { src: "/assets/gallery/djavira/crowd.jpg", alt: "קהל ברחבה" },
  { src: "/photo almog cohen website/WhatsApp Image 2025-04-24 at 03.31.09.jpeg", alt: "אלמוג מחייך על העמדה" },
  { src: "/assets/gallery/djavira/shoulders.jpg", alt: "על הכתפיים" },
  { src: "/assets/gallery/djavira/hupa-wide.jpeg", alt: "חופה - מבט רחב" },
  { src: "/photo almog cohen website/WhatsApp Image 2025-04-24 at 03.31.04.jpeg", alt: "זוג עם DJ ליד העמדה" },
  { src: "/assets/gallery/djavira/dance.jpg", alt: "ריקודים ברחבה" },
  { src: "/assets/gallery/djavira/party.jpg", alt: "מסיבה בלתי נשכחת" },
];

export default function GallerySection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useReveal();

  // Auto-slideshow for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-10 md:py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="reveal text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 text-white">רגעים מהאירועים שלי</h2>
          <div className="h-1 w-24 mx-auto mt-1 mb-3 bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full" />
          <p className="text-white text-base md:text-lg">כל תמונה מספרת סיפור של ערב בלתי נשכח</p>
        </div>

        {/* Mobile: Auto-slideshow */}
        <div className="md:hidden relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={photos[currentSlide].src}
                alt={photos[currentSlide].alt}
                fill
                className="object-cover"
                priority={currentSlide < 2}
              />
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-white w-6" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`reveal-stagger group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#03b28c] transition-all ${
                i === 0 || i === 3 ? "aspect-[4/3] md:col-span-2 md:row-span-2" : "aspect-square"
              }`}
              style={{ '--delay': `${i * 60}ms` } as React.CSSProperties}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
