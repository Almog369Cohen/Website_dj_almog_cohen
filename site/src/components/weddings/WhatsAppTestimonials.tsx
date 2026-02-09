"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const screenshots = [
  { src: "/assets/testimonials/wa-1.png", name: "שיראל ואופק" },
  { src: "/assets/testimonials/wa-2.png", name: "אוריאל ויעל" },
  { src: "/assets/testimonials/wa-4.png", name: "שיר ואדיר" },
  { src: "/assets/testimonials/wa-5.png", name: "הראל ואביב" },
];

export default function WhatsAppTestimonials() {
  const [selected, setSelected] = useState<number | null>(null);
  const [currentMobile, setCurrentMobile] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMobile((prev) => (prev + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMobile}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={() => setSelected(currentMobile)}
              className="relative w-[260px] aspect-[9/19] rounded-[2rem] overflow-hidden border-2 border-foreground/10 shadow-2xl hover:border-[#25D366]/50 transition-all active:scale-[0.97]"
            >
              <Image
                src={screenshots[currentMobile].src}
                alt={`ביקורת מ${screenshots[currentMobile].name}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 bg-[#25D366] rounded-full p-1.5 shadow-lg">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                <p className="text-white text-xs font-medium text-center">לחצו להגדלה</p>
              </div>
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-5">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentMobile(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentMobile ? "bg-[#25D366] w-6" : "bg-foreground/20 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:flex justify-center gap-6 max-w-4xl mx-auto">
        {screenshots.map((screenshot, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelected(i)}
            className={`group relative rounded-[2rem] overflow-hidden border-2 border-foreground/10 hover:border-[#25D366]/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.04] ${
              i === 1 ? "mt-6" : ""
            }`}
          >
            <div className="relative w-[220px] aspect-[9/19]">
              <Image
                src={screenshot.src}
                alt={`ביקורת מ${screenshot.name}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 bg-[#25D366] rounded-full p-1.5 shadow-lg opacity-80 group-hover:opacity-100 transition">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-xl">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
              aria-label="סגור"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + screenshots.length) % screenshots.length); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3 transition z-10"
              aria-label="הקודם"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % screenshots.length); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3 transition z-10"
              aria-label="הבא"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <motion.div
              key={selected}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-[300px] md:w-[340px] aspect-[9/19] rounded-[2rem] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={screenshots[selected].src}
                alt={`ביקורת מ${screenshots[selected].name}`}
                fill
                className="object-cover"
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium">
              {selected + 1} / {screenshots.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
