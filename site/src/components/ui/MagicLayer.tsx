"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * MAGIC LAYER - Advanced UI Effects
 * 
 * Features:
 * 1. Cinematic Preloader with brand logo
 * 2. Animated Film Grain background
 * 3. Magnetic Button effects (desktop only)
 * 
 * Mobile-First: All effects optimized for mobile performance
 */

interface MagicLayerProps {
  children: React.ReactNode;
  showPreloader?: boolean;
}

export const MagicLayer = ({ children, showPreloader = true }: MagicLayerProps) => {
  const [loading, setLoading] = useState(showPreloader);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (showPreloader) {
      // Simulate minimum loading time for animation
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // 2 seconds for smooth experience

      return () => clearTimeout(timer);
    }
  }, [showPreloader]);

  return (
    <>
      {/* FILM GRAIN BACKGROUND - Always active */}
      <FilmGrain />

      {/* CINEMATIC PRELOADER */}
      <AnimatePresence mode="wait" onExitComplete={() => setAnimationComplete(true)}>
        {loading && <CinematicPreloader />}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
};

/**
 * CINEMATIC PRELOADER
 * Elegant loading screen with brand logo pulse
 */
const CinematicPreloader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1f1f21]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Brand Noise Background */}
      <div className="brand-noise absolute inset-0 opacity-20" aria-hidden="true" />

      {/* Pulsing Logo/Text */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo Pulse Effect */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Main Brand Text */}
          <h1
            className="text-5xl font-black text-white md:text-7xl"
            style={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            DJ <span className="text-[#059cc0]">ALMOG</span>
          </h1>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 blur-2xl"
            style={{
              background: "radial-gradient(circle, rgba(5,156,192,0.4) 0%, transparent 70%)",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="mt-6 text-sm font-light tracking-widest text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          LOADING EXPERIENCE
        </motion.p>

        {/* Loading Dots Animation */}
        <motion.div className="mt-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-[#059cc0]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Screen Split Effect (exit animation) */}
      <motion.div
        className="absolute inset-0 bg-[#059cc0]"
        initial={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        style={{ originY: 0.5 }}
      />
    </motion.div>
  );
};

/**
 * FILM GRAIN BACKGROUND
 * Living texture that adds cinematic feel
 * Optimized for mobile (reduced on small screens)
 */
const FilmGrain = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.015] mix-blend-overlay">
      {/* CSS Animation for grain movement */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          animation: "grain 8s steps(10) infinite",
        }}
      />
    </div>
  );
};

/**
 * MAGNETIC BUTTON
 * Button that follows cursor on hover (desktop only)
 * Touch-friendly on mobile
 */
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number; // 1-100, how much the button moves
}

export const MagneticButton = ({
  children,
  className = "",
  href,
  onClick,
  strength = 30,
}: MagneticButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if mobile
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Disable on mobile

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Calculate movement with strength
    const moveX = (deltaX / rect.width) * strength;
    const moveY = (deltaY / rect.height) * strength;

    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const buttonContent = (
    <motion.div
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      whileTap={{ scale: isMobile ? 0.98 : 1 }} // Mobile feedback
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick}>
        {buttonContent}
      </a>
    );
  }

  return <div onClick={onClick}>{buttonContent}</div>;
};
