"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuProps {
  waNumber: string;
  waText: string;
}

export function MobileMenu({ waNumber, waText }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "בית" },
    { href: "/weddings", label: "חתונות" },
    { href: "/chogeg-menagen", label: "חוגג מנגן" },
    { href: "/academy", label: "Academy" },
    { href: "/music", label: "מוזיקה" },
    { href: "/playlists", label: "פלייליסטים" },
    { href: "/blog", label: "בלוג" },
    { href: "/about", label: "אודות" },
  ];

  return (
    <div className="md:hidden">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-black/50"
        aria-label="תפריט"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed top-16 left-4 right-4 p-4 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-[9999] max-h-[70vh] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 text-lg font-medium text-white hover:bg-white/10 rounded-xl transition-colors text-right"
              >
                {item.label}
              </Link>
            ))}
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 py-3 px-6 bg-gradient-to-r from-brand-green to-brand-blue rounded-full text-white font-bold text-center"
              onClick={() => setIsOpen(false)}
            >
              צור קשר
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
