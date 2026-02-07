"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote: "אלמוג הפך את החתונה שלנו לערב שכל האורחים עדיין מדברים עליו. הרחבה הייתה מלאה כל הזמן והאנרגיה הייתה מטורפת!",
    author: "שירה ויונתן",
    event: "חתונה באפריל 2025",
    image: "/photo almog cohen website/1-150.jpg",
  },
  {
    quote: "חיפשנו DJ שיבין את הסגנון שלנו - לא רק מוזיקה מסחרית. אלמוג הקשיב, הבין, והביא בדיוק את מה שרצינו. האנרגיה הייתה מושלמת!",
    author: "דנה ועומר",
    event: "חתונה ביוני 2024",
    image: "/photo almog cohen website/1-152.jpg",
  },
];

const DURATION = 6000;

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, DURATION);
    return () => clearInterval(interval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / DURATION, 1));
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current]);

  const t = testimonials[current];

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4">
            מה הזוגות אומרים
          </h2>
          <p className="text-white text-lg md:text-xl">1000+ המלצות אמיתיות מלקוחות מרוצים</p>
        </motion.div>

        <div className="relative">
          {/* Large quote mark */}
          <div className="absolute -top-6 right-4 md:right-0 text-[#03b28c]/20 text-[120px] md:text-[180px] font-serif leading-none select-none pointer-events-none z-0">
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="text-center px-4 md:px-16">
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-8">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white text-xl md:text-3xl font-bold leading-relaxed mb-10">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#03b28c]/40">
                    <Image
                      src={t.image}
                      alt={t.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <div className="font-black text-white text-lg">{t.author}</div>
                    <div className="text-white text-sm">{t.event}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar + dots */}
          <div className="mt-10 flex flex-col items-center gap-4">
            {/* Progress bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#059cc0] to-[#03b28c] rounded-full transition-none"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Dots */}
            <div className="flex gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-[#03b28c] scale-125"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
