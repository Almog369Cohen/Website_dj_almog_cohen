"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  showBorder?: boolean;
}

/**
 * GlassCard Component
 * 
 * מסגרת קבועה מגניבה עם גרדיינט וסקסי לכל הקלפים
 * תומך ב-Light/Dark mode אוטומטית
 */
export const GlassCard = ({ 
  children, 
  className = "", 
  hoverEffect = true,
  showBorder = true,
}: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-background p-8 backdrop-blur-xl transition-all duration-500 hover:border-brand-green/40 hover:shadow-[0_20px_60px_rgba(3,178,140,0.2)] md:p-10 ${className}`}
    >
      {/* Top Gradient Border - Always Visible & Sexy */}
      {showBorder && (
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-brand-green via-emerald-400 to-brand-blue opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      
      {/* Side Color Indicator - Always Visible */}
      {showBorder && (
        <div className="absolute left-0 top-1/2 h-32 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-green via-emerald-400 to-brand-blue shadow-lg shadow-brand-green/50 transition-all duration-500 group-hover:h-40" />
      )}
      
      {/* Noise Overlay */}
      <div className="brand-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

/**
 * Usage Example:
 * 
 * ```tsx
 * <GlassCard>
 *   <h3 className="text-foreground-heading">כותרת</h3>
 *   <p className="text-foreground-secondary">תוכן</p>
 * </GlassCard>
 * ```
 */
