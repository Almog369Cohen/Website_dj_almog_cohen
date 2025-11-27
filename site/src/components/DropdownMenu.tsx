"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownItem {
  label: string;
  href: string;
  color?: string;
}

interface DropdownMenuProps {
  title: string;
  items: DropdownItem[];
  mainHref?: string;
  clickOnly?: boolean;
}

export function DropdownMenu({ title, items, mainHref, clickOnly = false }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={clickOnly ? undefined : () => setIsOpen(true)}
      onMouseLeave={clickOnly ? undefined : () => setIsOpen(false)}
    >
      {/* Trigger */}
      <button
        className="group flex items-center gap-1.5 transition-colors duration-300 hover:text-brand-blue"
        onClick={() => setIsOpen(!isOpen)}
      >
        {mainHref ? (
          <Link href={mainHref} className="font-medium transition-colors duration-300 hover:text-brand-green">
            {title}
          </Link>
        ) : (
          <span className="font-medium">{title}</span>
        )}
        <svg
          className={`h-3.5 w-3.5 transition-all duration-300 ${isOpen ? "rotate-180 text-brand-blue" : "text-foreground-secondary"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Glow Effect */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-green/5" />
            
            <div className="relative p-3">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="group/item relative block overflow-hidden rounded-xl px-4 py-3 transition-all duration-300 hover:bg-foreground/5"
                    onClick={() => setIsOpen(false)}
                  >
                    {/* Hover Indicator Line */}
                    <div className={`absolute right-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b ${item.color || "from-[#059cc0] to-[#03b28c]"} transition-all duration-300 group-hover/item:h-8`} />
                    
                    {/* Content */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground-secondary transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:text-foreground-heading">
                        {item.label}
                      </span>
                      
                      {/* Arrow */}
                      <svg 
                        className="h-4 w-4 text-foreground-secondary opacity-0 transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:opacity-100"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
