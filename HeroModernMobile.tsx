// src/components/HeroModernMobile.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const HeroModernMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // אפקט פרלקסה רק בדסקטופ
  const xBlue = useTransform(mouseX, [-400, 400], [-25, 25]);
  const yBlue = useTransform(mouseY, [-400, 400], [-15, 15]);
  const xGreen = useTransform(mouseX, [-400, 400], [15, -15]);
  const yGreen = useTransform(mouseY, [-400, 400], [10, -10]);

  useEffect(() => {
    // בדיקת מובייל
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // בדיקת העדפת אנימציה מופחתת (נגישות)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Mouse tracking רק בדסקטופ
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile && !prefersReducedMotion) {
        const x = e.clientX - window.innerWidth / 2;
        const y = e.clientY - window.innerHeight / 2;
        mouseX.set(x);
        mouseY.set(y);
        setMousePosition({ x, y });
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, isMobile, prefersReducedMotion]);

  return (
    <section className="relative w-full min-h-screen bg-brand-dark flex items-center justify-center overflow-hidden">
      
      {/* 1. Mobile-Optimized Aurora Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* כתם כחול - מותאם למובייל */}
        <motion.div 
          style={!isMobile ? { x: xBlue, y: yBlue } : {}}
          animate={!prefersReducedMotion ? { 
            x: isMobile ? [0, 30, 0] : [0, 100, 0], 
            y: isMobile ? [0, -20, 0] : [0, -50, 0], 
            scale: isMobile ? [1, 1.1, 1] : [1, 1.2, 1],
            rotate: isMobile ? [0, 45, 0] : [0, 90, 0]
          } : {}}
          transition={{ 
            duration: isMobile ? 15 : 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`absolute ${
            isMobile 
              ? 'top-[-5%] left-[-5%] w-[300px] h-[300px]' 
              : 'top-[-10%] left-[-10%] w-[500px] h-[500px]'
          } bg-brand-blue rounded-full mix-blend-screen filter ${
            isMobile ? 'blur-[80px]' : 'blur-[120px]'
          } ${
            isMobile ? 'opacity-25' : 'opacity-40'
          }`}
        />
        
        {/* כתם ירוק - מותאם למובייל */}
        <motion.div 
          style={!isMobile ? { x: xGreen, y: yGreen } : {}}
          animate={!prefersReducedMotion ? { 
            x: isMobile ? [0, -40, 0] : [0, -100, 0], 
            y: isMobile ? [0, 25, 0] : [0, 50, 0], 
            scale: isMobile ? [1, 1.15, 1] : [1, 1.3, 1],
            rotate: isMobile ? [360, 270, 360] : [360, 180, 360]
          } : {}}
          transition={{ 
            duration: isMobile ? 18 : 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`absolute ${
            isMobile 
              ? 'bottom-[-5%] right-[-5%] w-[350px] h-[350px]' 
              : 'bottom-[-10%] right-[-10%] w-[600px] h-[600px]'
          } bg-brand-green rounded-full mix-blend-screen filter ${
            isMobile ? 'blur-[90px]' : 'blur-[140px]'
          } ${
            isMobile ? 'opacity-20' : 'opacity-30'
          }`}
        />
        
        {/* כתם סגול - רק בדסקטופ */}
        {!isMobile && (
          <motion.div 
            animate={!prefersReducedMotion ? { 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15],
              rotate: [0, 180, 360]
            } : {}}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"
          />
        )}
        
        {/* Enhanced Noise Texture - מופחת במובייל */}
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${
          isMobile ? 'opacity-10' : 'opacity-20'
        } brightness-100 contrast-150 mix-blend-soft-light`}></div>
        
        {/* Subtle Grid - רק בדסקטופ */}
        {!isMobile && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20"></div>
        )}
      </div>

      {/* 2. Mobile-Optimized Floating Particles */}
      {!isMobile && !prefersReducedMotion && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -80, 0],
                x: [0, Math.sin(i) * 30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 0.8,
              }}
              className="absolute w-1 h-1 bg-white/30 rounded-full blur-[0.5px]"
              style={{
                left: `${15 + i * 15}%`,
                top: `${25 + i * 10}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* 3. Mobile-First Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        
        {/* Mobile-Optimized Glass Container */}
        <motion.div
          animate={!prefersReducedMotion && !isMobile ? { 
            boxShadow: [
              "0 0 0 0 rgba(255,255,255,0)",
              "0 0 60px 0 rgba(255,255,255,0.08)",
              "0 0 0 0 rgba(255,255,255,0)"
            ]
          } : {}}
          transition={{ duration: 5, repeat: Infinity }}
          className={`relative ${
            isMobile ? 'p-4' : 'p-8'
          } rounded-3xl backdrop-blur-[2px] bg-white/[0.02] border border-white/10`}
        >
          
          {/* Enhanced Text - Mobile Optimized */}
          <motion.h1 
            initial={{ opacity: 0, y: isMobile ? 20 : 30, rotateX: isMobile ? 0 : -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className={`font-black mb-6 tracking-tight leading-[1.1] ${
              isMobile ? 'text-3xl' : 'text-5xl md:text-7xl'
            }`}
          >
            <span className="relative inline-block">
              {/* Shadow layer - רק בדסקטופ */}
              {!isMobile && (
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-brand-blue/40 via-brand-green/40 to-brand-blue/40 blur-lg"></span>
              )}
              <span className={`relative text-transparent bg-clip-text bg-gradient-to-r ${
                isMobile 
                  ? 'from-white via-gray-100 to-gray-200' 
                  : 'from-white via-white to-gray-300'
              }`}>
                לא מחפש למלא יומן.
              </span>
            </span>
            <br />
            <motion.span 
              animate={!prefersReducedMotion && !isMobile ? { 
                textShadow: [
                  "0 0 15px rgba(255,255,255,0.4)",
                  "0 0 25px rgba(255,255,255,0.6)",
                  "0 0 15px rgba(255,255,255,0.4)"
                ]
              } : {}}
              transition={{ duration: 4, repeat: Infinity }}
              className={`text-white ${isMobile ? 'drop-shadow-lg' : ''}`}
            >
              מחפש ליצור רגעים.
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: isMobile ? 15 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-gray-300/95 max-w-2xl mx-auto mb-12 leading-relaxed font-light ${
              isMobile ? 'text-base px-2' : 'text-lg md:text-xl'
            }`}
          >
            12 שנים, סטנדרטים ברזל ורחבות שבוערות עד הבוקר.
            <br />
            <span className="text-white/90 font-medium">הפסקול של האירוע שלכם מתחיל כאן.</span>
          </motion.p>

          {/* 4. Mobile-First Button System */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9, type: "spring" }}
            className={`flex ${
              isMobile ? 'flex-col' : 'flex-col sm:flex-row'
            } justify-center gap-4`}
          >
            {/* Primary Button - Enhanced for Mobile */}
            <motion.button 
              whileHover={!isMobile ? { 
                scale: 1.05,
                boxShadow: "0 0 60px -10px rgba(5,156,192,0.7)"
              } : {}}
              whileTap={{ scale: 0.98 }}
              className={`relative group bg-gradient-to-r from-brand-blue to-brand-green rounded-full font-bold text-black overflow-hidden shadow-[0_0_30px_-8px_rgba(5,156,192,0.5)] transition-all ${
                isMobile 
                  ? 'px-6 py-4 text-base w-full' 
                  : 'px-8 py-4 text-lg'
              }`}
            >
              <span className="relative z-10 drop-shadow-sm">בואו נבדוק התאמה</span>
              {/* Shimmer - רק בדסקטופ */}
              {!isMobile && (
                <motion.div
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              )}
              {/* Mobile glow */}
              {isMobile && (
                <div className="absolute inset-0 rounded-full border border-white/20 opacity-50"></div>
              )}
            </motion.button>

            {/* Secondary Glass Button */}
            <motion.button 
              whileHover={!isMobile ? { 
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.1)"
              } : {}}
              whileTap={{ scale: 0.98 }}
              className={`border border-white/30 rounded-full font-medium text-white backdrop-blur-md bg-white/5 hover:border-white/50 transition-all ${
                isMobile 
                  ? 'px-6 py-4 text-base w-full' 
                  : 'px-8 py-4 text-lg'
              }`}
            >
              לשמוע סטים
            </motion.button>
          </motion.div>
        </motion.div>

      </div>

      {/* 5. Ambient Corner Glows - Reduced for Mobile */}
      <div className={`absolute top-0 left-0 bg-gradient-to-br from-brand-blue/8 to-transparent rounded-full blur-3xl ${
        isMobile ? 'w-[200px] h-[200px]' : 'w-[300px] h-[300px]'
      }`}></div>
      <div className={`absolute bottom-0 right-0 bg-gradient-to-tl from-brand-green/8 to-transparent rounded-full blur-3xl ${
        isMobile ? 'w-[250px] h-[250px]' : 'w-[400px] h-[400px]'
      }`}></div>

      {/* 6. High Contrast Mode Support */}
      <style jsx>{`
        @media (prefers-contrast: high) {
          .bg-brand-blue { background-color: #0066cc !important; }
          .bg-brand-green { background-color: #00aa66 !important; }
          .text-white { color: #ffffff !important; }
          .border-white/10 { border-color: rgba(255,255,255,0.3) !important; }
        }
        
        @media (prefers-color-scheme: light) {
          .bg-brand-dark { background-color: #f8fafc !important; }
          .text-white { color: #1a202c !important; }
          .text-gray-300 { color: #4a5568 !important; }
        }
        
        /* Mobile Performance Optimization */
        @media (max-width: 768px) {
          * {
            will-change: auto !important;
          }
          
          .mix-blend-screen {
            mix-blend-mode: normal;
          }
        }
      `}</style>
      
    </section>
  );
};

export default HeroModernMobile;
