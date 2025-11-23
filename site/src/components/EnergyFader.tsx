"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useEnergy } from "@/context/EnergyContext";
import { useIsMobile } from "@/hooks/useMediaQuery";

export const EnergyFader = () => {
  const { energyLevel, setEnergyLevel } = useEnergy();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate height/width for the drag constraint
  const [constraints, setConstraints] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      if (isMobile) {
        // Mobile: Horizontal drag
        const width = containerRef.current.offsetWidth;
        setConstraints({ top: 0, bottom: 0, left: 0, right: width - 48 }); // 48 is knob size
      } else {
        // Desktop: Vertical drag
        const height = containerRef.current.offsetHeight;
        setConstraints({ top: 0, bottom: height - 48, left: 0, right: 0 });
      }
    }
  }, [isMobile]);

  // Map motion value to energy level
  // Note: We don't use useMotionValue for the source of truth because we want React state to control the vibe
  // But we use it for smooth animations
  
  const handleDrag = (event: any, info: any) => {
    if (!containerRef.current) return;
    
    let newLevel = 0;
    
    if (isMobile) {
      const width = containerRef.current.offsetWidth - 48;
      const x = info.point.x - containerRef.current.getBoundingClientRect().left;
      const clampedX = Math.max(0, Math.min(x, width));
      newLevel = (clampedX / width) * 100;
    } else {
      const height = containerRef.current.offsetHeight - 48;
      const y = info.point.y - containerRef.current.getBoundingClientRect().top;
      const clampedY = Math.max(0, Math.min(y, height));
      // Invert for vertical (bottom is 0, top is 100)
      newLevel = 100 - ((clampedY / height) * 100);
    }

    setEnergyLevel(Math.round(newLevel));
  };

  return (
    <div 
      className={`fixed z-50 flex items-center justify-center
        ${isMobile 
          ? "bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/90 to-transparent px-6 pb-6 pt-10" 
          : "right-8 top-1/2 h-[300px] w-16 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 py-4"
        }`}
    >
      <div className="relative h-full w-full">
        
        {/* TRACK */}
        <div 
          ref={containerRef}
          className={`absolute bg-white/10 rounded-full overflow-hidden
            ${isMobile 
              ? "left-0 right-0 top-1/2 h-2 -translate-y-1/2" 
              : "top-0 bottom-0 left-1/2 w-2 -translate-x-1/2"
            }`}
        >
          {/* FILL BAR */}
          <div 
            className="absolute bg-gradient-to-t from-brand-green to-brand-blue transition-all duration-75 ease-linear shadow-[0_0_20px_currentColor]"
            style={isMobile ? {
              left: 0,
              top: 0,
              bottom: 0,
              width: `${energyLevel}%`
            } : {
              bottom: 0,
              left: 0,
              right: 0,
              height: `${energyLevel}%`
            }}
          />
        </div>

        {/* KNOB (Visual Only - following state) */}
        <motion.div
          drag={isMobile ? "x" : "y"}
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={isMobile ? {
            left: `${energyLevel}%`,
            top: "50%",
            y: "-50%",
            x: "-50%" // Center the knob
          } : {
            bottom: `${energyLevel}%`,
            left: "50%",
            x: "-50%",
            y: "50%" // Center the knob
          }}
        >
          {/* Knob Graphic */}
          <div className={`
            relative flex items-center justify-center
            h-12 w-8 rounded-md border border-white/20 
            bg-gradient-to-b from-[#333] to-[#111] 
            shadow-[0_4px_10px_rgba(0,0,0,0.8)]
            ${isMobile ? "rotate-90" : ""}
          `}>
            {/* Metallic Line */}
            <div className="h-[2px] w-6 bg-white/80 shadow-[0_0_5px_white]" />
            
            {/* Glow Effect based on energy */}
            <div 
              className="absolute inset-0 rounded-md transition-opacity duration-100"
              style={{
                boxShadow: `0 0 ${energyLevel / 3}px ${energyLevel / 5}px rgba(5, 156, 192, ${energyLevel / 100})`,
                opacity: energyLevel / 100
              }}
            />
          </div>
        </motion.div>

        {/* LABELS */}
        {!isMobile && (
          <>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-brand-blue uppercase">Rave</div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-white/40 uppercase">Chill</div>
          </>
        )}
      </div>
    </div>
  );
};
