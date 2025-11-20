"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  waNumber: string;
  waText: string;
}

export function MobileMenu({ waNumber, waText }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut" as const,
      },
    }),
  };

  const menuItems = [
    { href: "/services", label: "שירותים" },
    { href: "/chogeg-menagen", label: "חוגג מנגן" },
    { href: "/music", label: "מוזיקה" },
    { href: "/blog", label: "בלוג" },
    { href: "/about", label: "אודות" },
  ];

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={toggleMenu}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm transition hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-brand-blue md:hidden"
        aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
        aria-expanded={isOpen}
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="h-0.5 w-5 bg-white transition-all"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="h-0.5 w-5 bg-white transition-all"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="h-0.5 w-5 bg-white transition-all"
        />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed right-0 top-0 z-50 flex h-full w-[280px] flex-col bg-gradient-to-b from-brand-dark via-brand-dark/95 to-black p-6 shadow-2xl md:hidden"
            role="dialog"
            aria-label="תפריט ניווט נייד"
          >
            {/* Close Button */}
            <button
              onClick={closeMenu}
              className="mb-8 flex h-10 w-10 items-center justify-center self-end rounded-lg border border-white/20 bg-white/10 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              aria-label="סגור תפריט"
            >
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo/Title */}
            <Link
              href="/"
              onClick={closeMenu}
              className="mb-8 text-right text-2xl font-bold text-brand-blue"
            >
              DJ Almog Cohen
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2" role="navigation" aria-label="תפריט ראשי נייד">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  custom={i}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-right text-base font-medium text-white transition hover:border-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Contact Button */}
            <motion.a
              custom={menuItems.length}
              variants={linkVariants}
              initial="closed"
              animate="open"
              href={`https://wa.me/${waNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-6 py-4 text-base font-bold text-black shadow-lg transition hover:scale-105 hover:shadow-brand-green/50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              onClick={closeMenu}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>צור קשר בוואטסאפ</span>
            </motion.a>

            {/* Footer Info */}
            <div className="mt-auto border-t border-white/10 pt-4 text-center text-xs text-white/50">
              <p>© {new Date().getFullYear()} DJ Almog Cohen</p>
              <p className="mt-1">מוזיקה • יצירה • מנטורינג</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
