"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(80, Math.min(150, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle("high-contrast");
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    document.documentElement.classList.toggle("reduce-motion");
  };

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-blue bg-black/80 backdrop-blur-sm shadow-lg transition hover:border-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 left-0 w-64 rounded-xl border border-white/20 bg-black/90 p-4 backdrop-blur-xl shadow-2xl"
            role="dialog"
            aria-label="Accessibility settings"
          >
            <h3 className="mb-4 text-sm font-bold text-white">נגישות</h3>

            {/* Font Size */}
            <div className="mb-4">
              <label className="mb-2 block text-xs text-white/70">גודל טקסט</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustFontSize(-10)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <span className="flex-1 text-center text-sm text-white">{fontSize}%</span>
                <button
                  onClick={() => adjustFontSize(10)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <button
              onClick={toggleHighContrast}
              className={`mb-3 w-full rounded-lg p-3 text-right text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                highContrast ? "bg-brand-blue text-black" : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-pressed={highContrast}
            >
              <span className="font-semibold">ניגודיות גבוהה</span>
            </button>

            {/* Reduced Motion */}
            <button
              onClick={toggleReducedMotion}
              className={`w-full rounded-lg p-3 text-right text-sm transition focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                reducedMotion ? "bg-brand-blue text-black" : "bg-white/10 text-white hover:bg-white/20"
              }`}
              aria-pressed={reducedMotion}
            >
              <span className="font-semibold">הפחתת אנימציות</span>
            </button>

            <div className="mt-4 border-t border-white/10 pt-3">
              <a
                href="#main-content"
                className="block rounded-lg bg-brand-green p-2 text-center text-xs font-bold text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                דלג לתוכן הראשי
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
