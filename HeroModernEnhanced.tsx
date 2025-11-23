// src/components/HeroModernEnhanced.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const HeroModernEnhanced = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // יצירת אפקט פרלקסה מגנטית
  const xBlue = useTransform(mouseX, [-400, 400], [-50, 50]);
  const yBlue = useTransform(mouseY, [-400, 400], [-30, 30]);
  const xGreen = useTransform(mouseX, [-400, 400], [30, -30]);
  const yGreen = useTransform(mouseY, [-400, 400], [20, -20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative w-full min-h-screen bg-brand-dark flex items-center justify-center overflow-hidden">
      
      {/* 1. Enhanced Aurora Background - רקע מגנטי */}
      <div className="absolute inset-0 w-full h-full">
        {/* כתם כחול עם תגובה לעכבר */}
        <motion.div 
          style={{ x: xBlue, y: yBlue }}
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0], 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-blue rounded-full mix-blend-screen filter blur-[120px] opacity-40"
        />
        
        {/* כתם ירוק עם תגובה הפוכה לעכבר */}
        <motion.div 
          style={{ x: xGreen, y: yGreen }}
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 50, 0], 
            scale: [1, 1.3, 1],
            rotate: [360, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-green rounded-full mix-blend-screen filter blur-[140px] opacity-30"
        />
        
        {/* כתם נוסף - סגול למעלה מימין */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-25"
        />
        
        {/* Enhanced Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30"></div>
      </div>

      {/* 2. Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 bg-white/40 rounded-full blur-[1px]"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 8}%`,
            }}
          />
        ))}
      </div>

      {/* 3. Enhanced Central Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        
        {/* Magnetic cursor effect area */}
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 0 0 rgba(255,255,255,0)",
              "0 0 100px 0 rgba(255,255,255,0.1)",
              "0 0 0 0 rgba(255,255,255,0)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative p-8 rounded-3xl backdrop-blur-[2px] bg-white/[0.02] border border-white/10"
        >
          
          {/* Enhanced Text with better animation */}
          <motion.h1 
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]"
          >
            <span className="relative inline-block">
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-brand-blue/50 via-brand-green/50 to-brand-blue/50 blur-lg"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-300">
                לא מחפש למלא יומן.
              </span>
            </span>
            <br />
            <motion.span 
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-white"
            >
              מחפש ליצור רגעים.
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            12 שנים, סטנדרטים ברזל ורחבות שבוערות עד הבוקר.
            <br />
            <span className="text-white/80 font-medium">הפסקול של האירוع שלכם מתחיל כאן.</span>
          </motion.p>

          {/* 4. Enhanced Button System */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9, type: "spring" }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {/* Primary Magnetic Button */}
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 80px -15px rgba(5,156,192,0.8)"
              }}
              whileTap={{ scale: 0.98 }}
              className="relative group px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-green rounded-full font-bold text-black overflow-hidden shadow-[0_0_40px_-10px_rgba(5,156,192,0.5)] transition-all"
            >
              <span className="relative z-10 drop-shadow-sm">בואו נבדוק התאמה</span>
              {/* Enhanced shimmer effect */}
              <motion.div
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
              {/* Magnetic hover border */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>

            {/* Secondary Glass Button */}
            <motion.button 
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-white/30 rounded-full font-medium text-white backdrop-blur-md bg-white/5 hover:border-white/50 transition-all"
            >
              לשמוע סטים
            </motion.button>
          </motion.div>
        </motion.div>

      </div>

      {/* 5. Ambient Corner Glows */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-to-br from-brand-blue/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-brand-green/10 to-transparent rounded-full blur-3xl"></div>
      
    </section>
  );
};

export default HeroModernEnhanced;
