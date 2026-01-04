"use client";

import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useEnergy } from "@/context/EnergyContext";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { ADVANCED_THEMES } from "@/context/ThemeContext";

export const EnergyFaderV2 = () => {
  const { theme, energyLevel, setEnergyLevel, isTransitioning } = useTheme();
  const { setEnergyLevel: setEnergyContextLevel } = useEnergy();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [constraints, setConstraints] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    if (containerRef.current) {
      if (isMobile) {
        const width = containerRef.current.offsetWidth;
        setConstraints({ top: 0, bottom: 0, left: 0, right: width - 48 });
      } else {
        const height = containerRef.current.offsetHeight;
        setConstraints({ top: 0, bottom: height - 48, left: 0, right: 0 });
      }
    }
  }, [isMobile]);

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
      newLevel = 100 - ((clampedY / height) * 100);
    }

    setEnergyLevel(Math.round(newLevel));
    setEnergyContextLevel(Math.round(newLevel)); // Sync with EnergyContext
  };

  return (
    <div 
      className={`fixed z-50 flex items-center justify-center transition-colors duration-500
        ${isMobile 
          ? "bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/90 to-transparent px-6 pb-6 pt-10" 
          : "right-8 top-1/2 h-[400px] w-20 -translate-y-1/2 rounded-2xl backdrop-blur-xl border-2 py-6"
        }`}
      style={{
        backgroundColor: isMobile ? undefined : `${theme.bg}cc`,
        borderColor: isMobile ? undefined : theme.border,
      }}
    >
      <div className="relative h-full w-full">
        
        {/* TRACK */}
        <div 
          ref={containerRef}
          className={`absolute rounded-full overflow-hidden transition-colors duration-500
            ${isMobile 
              ? "left-0 right-0 top-1/2 h-3 -translate-y-1/2" 
              : "top-0 bottom-0 left-1/2 w-3 -translate-x-1/2"
            }`}
          style={{
            backgroundColor: theme.bgSecondary,
            boxShadow: `inset 0 2px 4px ${theme.shadow}`,
          }}
        >
          {/* FILL BAR */}
          <div 
            className="absolute transition-all duration-300 ease-out"
            style={isMobile ? {
              left: 0,
              top: 0,
              bottom: 0,
              width: `${energyLevel}%`,
              background: `linear-gradient(to right, ${theme.accent}, ${theme.text})`,
              boxShadow: `0 0 20px ${theme.accent}80`,
            } : {
              bottom: 0,
              left: 0,
              right: 0,
              height: `${energyLevel}%`,
              background: `linear-gradient(to top, ${theme.accent}, ${theme.text})`,
              boxShadow: `0 0 20px ${theme.accent}80`,
            }}
          />
        </div>

        {/* KNOB */}
        <motion.div
          drag={isMobile ? "x" : "y"}
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={isMobile ? {
            left: `${energyLevel}%`,
            top: "50%",
            y: "-50%",
            x: "-50%",
          } : {
            bottom: `${energyLevel}%`,
            left: "50%",
            x: "-50%",
            y: "50%",
          }}
        >
          {/* Knob Design */}
          <div 
            className={`relative flex items-center justify-center h-12 w-10 rounded-xl shadow-2xl transition-all duration-300 ${isMobile ? "rotate-90" : ""}`}
            style={{
              background: `linear-gradient(135deg, ${theme.bgSecondary}, ${theme.bg})`,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: theme.accent,
              boxShadow: `
                0 4px 20px ${theme.shadow},
                0 0 ${energyLevel / 2}px ${theme.accent}80,
                inset 0 1px 2px ${theme.text}20
              `,
            }}
          >
            {/* Grip Lines */}
            <div className="flex flex-col gap-1 items-center">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="h-0.5 w-5 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: theme.textSecondary,
                    opacity: 0.6 + (energyLevel / 200),
                  }}
                />
              ))}
            </div>
            
            {/* Glow Effect */}
            <div 
              className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${theme.accent}40, transparent 70%)`,
                opacity: energyLevel / 150,
              }}
            />
          </div>
        </motion.div>

        {/* LABELS & INFO - Desktop Only */}
        {!isMobile && (
          <>
            {/* Top Label */}
            <div 
              className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-widest uppercase transition-colors duration-300"
              style={{ color: theme.accent }}
            >
              Rave
            </div>
            
            {/* Bottom Label */}
            <div 
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-widest uppercase transition-colors duration-300"
              style={{ color: theme.textSecondary }}
            >
              Chill
            </div>
            
            {/* Theme Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -right-44 top-1/2 -translate-y-1/2 w-36 rounded-2xl p-3 transition-colors duration-500"
              style={{
                backgroundColor: `${theme.bg}f0`,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme.border,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 8px 32px ${theme.shadow}`,
              }}
            >
              {/* Theme Name */}
              <div className="mb-2">
                <div 
                  className="text-[8px] font-semibold uppercase tracking-wider mb-1 transition-colors duration-300"
                  style={{ color: theme.textSecondary }}
                >
                  Current Theme
                </div>
                <div 
                  className="text-sm font-bold transition-colors duration-300"
                  style={{ 
                    color: theme.text,
                    direction: 'rtl',
                  }}
                >
                  {theme.name}
                </div>
              </div>

              {/* Energy Level */}
              <div className="mb-2">
                <div 
                  className="text-[8px] font-semibold uppercase tracking-wider mb-1 transition-colors duration-300"
                  style={{ color: theme.textSecondary }}
                >
                  Energy
                </div>
                <div 
                  className="text-2xl font-black tabular-nums transition-colors duration-300"
                  style={{ color: theme.accent }}
                >
                  {Math.round(energyLevel)}
                  <span className="text-xs ml-0.5" style={{ color: theme.textSecondary }}>%</span>
                </div>
              </div>

              {/* Color Preview */}
              <div className="space-y-1.5">
                <div 
                  className="text-[8px] font-semibold uppercase tracking-wider mb-1 transition-colors duration-300"
                  style={{ color: theme.textSecondary }}
                >
                  Colors
                </div>
                <div className="flex gap-1.5">
                  <div 
                    className="h-5 flex-1 rounded transition-all duration-300"
                    style={{ 
                      backgroundColor: theme.bg,
                      border: `1px solid ${theme.border}`,
                    }}
                    title="Background"
                  />
                  <div 
                    className="h-5 flex-1 rounded transition-all duration-300"
                    style={{ 
                      backgroundColor: theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
                    title="Text"
                  />
                  <div 
                    className="h-5 flex-1 rounded transition-all duration-300"
                    style={{ 
                      backgroundColor: theme.accent,
                      boxShadow: `0 2px 8px ${theme.accent}60`,
                    }}
                    title="Accent"
                  />
                </div>
              </div>

              {/* Contrast Badge */}
              <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${theme.border}` }}>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-[8px] font-semibold uppercase tracking-wider transition-colors duration-300"
                    style={{ color: theme.textSecondary }}
                  >
                    Contrast
                  </span>
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-xs font-bold tabular-nums transition-colors duration-300"
                      style={{ color: theme.text }}
                    >
                      {theme.contrast.toFixed(1)}:1
                    </span>
                    {theme.wcagAAA && (
                      <span 
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded transition-colors duration-300"
                        style={{ 
                          backgroundColor: `${theme.accent}20`,
                          color: theme.accent,
                        }}
                      >
                        AAA
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
