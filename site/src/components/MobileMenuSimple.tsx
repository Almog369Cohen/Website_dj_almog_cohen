"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  waNumber: string;
  waText: string;
}

export function MobileMenu({ waNumber, waText }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { href: "/", label: "בית" },
    { href: "/weddings", label: "חתונות" },
    { href: "/events", label: "אירועים" },
    { href: "/chogeg-menagen", label: "חוגג מנגן" },
    { href: "/academy", label: "Academy" },
    { href: "/music", label: "מוזיקה" },
    { href: "/playlists", label: "פלייליסטים" },
    { href: "/blog", label: "בלוג" },
    { href: "/about", label: "אודות" },
  ];

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={toggleMenu}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-black/50 backdrop-blur-sm md:hidden"
        aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
      >
        <span className={`h-0.5 w-5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`h-0.5 w-5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`h-0.5 w-5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[99999] md:hidden"
              onClick={closeMenu}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-[100000] flex flex-col items-center justify-center md:hidden"
            >
              {/* Close Button */}
              <button
                onClick={closeMenu}
                className="absolute top-4 right-4 p-3 text-white"
                aria-label="סגור"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Menu Items */}
              <nav className="flex flex-col items-center gap-6">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="text-2xl font-bold text-white hover:text-brand-green transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* WhatsApp Button */}
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                href={`https://wa.me/${waNumber}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 px-8 py-4 bg-gradient-to-r from-brand-green to-brand-blue rounded-full text-white font-bold"
                onClick={closeMenu}
              >
                צור קשר בוואטסאפ
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileMenu;
