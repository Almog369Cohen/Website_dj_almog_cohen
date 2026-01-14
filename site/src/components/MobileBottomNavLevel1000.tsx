"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MobileBottomNav Level 1000
 * - מסונכרן עם התפריט הראשי
 * - צבעי מותג: Blue #059cc0, Green #03b28c, Gray #1f1f21
 * - Glassmorphism + Glow effects
 * - Safe area padding for notched devices
 */

// Brand Colors
const BRAND = {
  blue: "#059cc0",
  green: "#03b28c",
  gray: "#1f1f21",
  white: "#ffffff",
};

// Haptic feedback
const vibrate = (pattern: number | number[] = 10) => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};

interface NavItem {
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  color: "blue" | "green" | "gradient";
  isExternal?: boolean;
  isCTA?: boolean;
}

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent("היי אלמוג, חתונה בתאריך ____. אולם/אזור: ____. כמות אורחים: ____. אפשר לבדוק זמינות?")}`;
const phoneNumber = "0502427616";
const phoneLink = `tel:${phoneNumber}`;

// Icons with filled/outline variants
const Icons = {
  home: {
    outline: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    filled: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
    ),
  },
  events: {
    outline: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
    filled: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  party: {
    outline: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
    filled: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" />
      </svg>
    ),
  },
  academy: {
    outline: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    filled: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
        <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
        <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
      </svg>
    ),
  },
  whatsapp: {
    outline: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    filled: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  phone: {
    outline: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a2.25 2.25 0 002.25-2.25v-1.372a1.125 1.125 0 00-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.143-7.143 1.125 1.125 0 01.38-1.21l1.293-.97a1.125 1.125 0 00.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    filled: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.5 6A4.5 4.5 0 006 10.5h.75a.75.75 0 01.75.75v2.25A4.5 4.5 0 0012 18h1.5a.75.75 0 01.75.75V21a1.5 1.5 0 01-1.5 1.5H12C5.787 22.5.75 17.463.75 11.25V10.5A4.5 4.5 0 011.5 6z" />
        <path d="M8.25 3.75A1.5 1.5 0 019.75 2.25h1.5a1.5 1.5 0 011.5 1.5v1.5a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-1.5z" />
      </svg>
    ),
  },
  check: {
    outline: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      </svg>
    ),
    filled: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75S6.615 21.75 12 21.75 21.75 17.385 21.75 12 17.385 2.25 12 2.25zm3.61 7.185a.75.75 0 10-1.22-.87l-3.67 5.14-1.41-1.41a.75.75 0 10-1.06 1.06l2.05 2.05a.75.75 0 001.14-.09l4.17-5.88z" clipRule="evenodd" />
      </svg>
    ),
  },
};

// Lead-first mobile bar
const navItems: NavItem[] = [
  {
    href: waLink,
    icon: Icons.whatsapp.outline,
    activeIcon: Icons.whatsapp.filled,
    label: "וואטסאפ",
    color: "green",
    isExternal: true,
  },
  {
    href: phoneLink,
    icon: Icons.phone.outline,
    activeIcon: Icons.phone.filled,
    label: "שיחה",
    color: "blue",
    isExternal: true,
  },
  {
    href: "/weddings/fit-check",
    icon: Icons.check.outline,
    activeIcon: Icons.check.filled,
    label: "בדיקת התאמה",
    color: "gradient",
    isCTA: true,
  },
];

export function MobileBottomNavLevel1000() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("has-bottom-nav");
    return () => {
      document.body.classList.remove("has-bottom-nav");
    };
  }, []);

  if (!mounted) return null;

  const handleClick = () => {
    vibrate(10);
  };

  const getColorClass = (color: NavItem["color"], isActive: boolean, isGradientItem: boolean = false) => {
    // חוגג מנגן always shows gradient colors
    if (isGradientItem && color === "gradient") return "text-[#03b28c]";
    if (!isActive) return "text-white/60";
    switch (color) {
      case "blue":
        return "text-[#059cc0]";
      case "green":
        return "text-[#03b28c]";
      case "gradient":
        return "text-white";
      default:
        return "text-white";
    }
  };

  const getGlowStyle = (color: NavItem["color"], isActive: boolean) => {
    if (!isActive) return {};
    switch (color) {
      case "blue":
        return { filter: "drop-shadow(0 0 8px rgba(5, 156, 192, 0.6))" };
      case "green":
        return { filter: "drop-shadow(0 0 8px rgba(3, 178, 140, 0.6))" };
      case "gradient":
        return { filter: "drop-shadow(0 0 10px rgba(3, 178, 140, 0.8))" };
      default:
        return {};
    }
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden pb-safe"
      aria-label="קיצור דרך לפנייה"
    >
      {/* Glassmorphism Background */}
      <div 
        className="absolute inset-0 backdrop-blur-xl"
        style={{ 
          background: `linear-gradient(to top, ${BRAND.gray}ee, ${BRAND.gray}dd)`,
          borderTop: `1px solid rgba(255,255,255,0.1)`,
        }}
      />
      
      {/* Top Glow Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND.blue}40, ${BRAND.green}40, transparent)`,
        }}
      />

      {/* Lead Items */}
      <div 
        className="relative flex items-stretch justify-around"
        style={{ 
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          paddingTop: "8px",
        }}
      >
        {navItems.map((item) => {
          const isActive = !item.isExternal && (pathname === item.href || pathname.startsWith(item.href));
          
          const NavComponent = item.isExternal ? "a" : Link;
          const navProps = item.isExternal 
            ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
            : { href: item.href };

          return (
            <NavComponent
              key={item.href}
              {...navProps}
              onClick={handleClick}
              className={`
                relative flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px]
                transition-all duration-300 ease-out
                ${item.isCTA ? "-mt-5" : ""}
              `}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              {/* CTA Special Background - Floating Circle */}
              {item.isCTA && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full -z-10"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.blue})`,
                    boxShadow: `0 4px 15px rgba(3, 178, 140, 0.5), 0 0 30px rgba(5, 156, 192, 0.3)`,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      `0 4px 15px rgba(3, 178, 140, 0.5), 0 0 30px rgba(5, 156, 192, 0.3)`,
                      `0 6px 25px rgba(3, 178, 140, 0.7), 0 0 45px rgba(5, 156, 192, 0.5)`,
                      `0 4px 15px rgba(3, 178, 140, 0.5), 0 0 30px rgba(5, 156, 192, 0.3)`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Active Indicator */}
              <AnimatePresence>
                {isActive && !item.isCTA && (
                  <motion.div
                    layoutId="activeIndicator"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-1 w-8 h-1 rounded-full"
                    style={{
                      background: item.color === "blue" 
                        ? BRAND.blue 
                        : item.color === "green" 
                          ? BRAND.green 
                          : `linear-gradient(90deg, ${BRAND.green}, ${BRAND.blue})`,
                      boxShadow: item.color === "blue"
                        ? `0 0 10px ${BRAND.blue}`
                        : `0 0 10px ${BRAND.green}`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.span
                className={`transition-colors duration-300 ${
                  getColorClass(item.color, isActive, item.isCTA)
                }`}
                style={getGlowStyle(item.color, isActive)}
                whileTap={{ scale: 0.9 }}
              >
                {isActive ? item.activeIcon : item.icon}
              </motion.span>

              {/* Label */}
              <span 
                className={`
                  text-[10px] font-medium transition-colors duration-300
                  ${isActive 
                    ? item.isCTA 
                      ? "text-white font-bold" 
                      : item.color === "blue" 
                        ? "text-[#059cc0]" 
                        : "text-[#03b28c]"
                    : "text-white/50"
                  }
                `}
              >
                {item.label}
              </span>
            </NavComponent>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default MobileBottomNavLevel1000;
