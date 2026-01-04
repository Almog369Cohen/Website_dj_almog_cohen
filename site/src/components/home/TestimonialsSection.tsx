"use client";

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
          <div className="flex gap-4 overflow-x-auto pb-6 px-4 -mx-4 md:hidden snap-x snap-mandatory scrollbar-hide">
            {testimonialMockups.map((mockup, index) => (
              <motion.div
                key={mockup.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[260px] snap-center"
                style={{ transform: `rotate(${mockup.rotation}deg)` }}
              >
                <Image
                  src={mockup.image}
                  alt={`המלצה מ${mockup.name}`}
                  width={400}
                  height={800}
                  className="w-full h-auto drop-shadow-2xl"
                />
                <p className="mt-3 text-center text-foreground-secondary text-sm font-medium">{mockup.name}</p>
              </motion.div>
            ))}
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
