"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { OKLCHColor, oklchToHex, interpolateOKLCH, hexToRgb, getContrastRatio, meetsWCAG } from "@/utils/colorUtils";
import { Easing } from "@/utils/easingFunctions";

// 10-Level Advanced Theme System (OKLCH for perceptual uniformity)
const ADVANCED_THEMES: ThemeLevel[] = [
  {
    level: 0,
    name: "בוקר מוקדם",
    bg: { l: 0.98, c: 0.015, h: 220 },
    text: { l: 0.15, c: 0.025, h: 240 },
    accent: { l: 0.55, c: 0.15, h: 200 },
    mood: "fresh",
  },
  {
    level: 11,
    name: "יום בהיר",
    bg: { l: 0.95, c: 0.02, h: 215 },
    text: { l: 0.20, c: 0.03, h: 235 },
    accent: { l: 0.52, c: 0.16, h: 195 },
    mood: "energetic",
  },
  {
    level: 22,
    name: "צהריים",
    bg: { l: 0.88, c: 0.04, h: 210 },
    text: { l: 0.25, c: 0.04, h: 230 },
    accent: { l: 0.48, c: 0.17, h: 190 },
    mood: "bright",
  },
  {
    level: 33,
    name: "אחר צהריים",
    bg: { l: 0.75, c: 0.06, h: 205 },
    text: { l: 0.20, c: 0.04, h: 225 },
    accent: { l: 0.45, c: 0.18, h: 185 },
    mood: "warm",
  },
  {
    level: 44,
    name: "ערב מוקדם",
    bg: { l: 0.60, c: 0.08, h: 200 },
    text: { l: 0.95, c: 0.02, h: 220 },
    accent: { l: 0.65, c: 0.19, h: 180 },
    mood: "golden",
  },
  {
    level: 55,
    name: "דמדומים",
    bg: { l: 0.45, c: 0.10, h: 265 },
    text: { l: 0.95, c: 0.02, h: 215 },
    accent: { l: 0.70, c: 0.20, h: 175 },
    mood: "twilight",
  },
  {
    level: 66,
    name: "ערב",
    bg: { l: 0.30, c: 0.08, h: 270 },
    text: { l: 0.95, c: 0.02, h: 210 },
    accent: { l: 0.72, c: 0.21, h: 170 },
    mood: "evening",
  },
  {
    level: 77,
    name: "לילה",
    bg: { l: 0.20, c: 0.06, h: 275 },
    text: { l: 0.95, c: 0.02, h: 205 },
    accent: { l: 0.75, c: 0.22, h: 165 },
    mood: "night",
  },
  {
    level: 88,
    name: "לילה עמוק",
    bg: { l: 0.12, c: 0.04, h: 280 },
    text: { l: 0.97, c: 0.01, h: 200 },
    accent: { l: 0.78, c: 0.23, h: 160 },
    mood: "deep",
  },
  {
    level: 100,
    name: "Rave / חצות",
    bg: { l: 0.05, c: 0.02, h: 285 },
    text: { l: 0.98, c: 0.01, h: 195 },
    accent: { l: 0.80, c: 0.24, h: 155 },
    mood: "rave",
  },
];

interface ThemeLevel {
  level: number;
  name: string;
  bg: OKLCHColor;
  text: OKLCHColor;
  accent: OKLCHColor;
  mood: string;
}

interface ComputedTheme {
  bg: string;
  text: string;
  accent: string;
  bgSecondary: string;
  textSecondary: string;
  border: string;
  shadow: string;
  contrast: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  mood: string;
  name: string;
}

interface ThemeContextValue {
  theme: ComputedTheme;
  energyLevel: number;
  setEnergyLevel: (level: number) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [energyLevel, setEnergyLevelState] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rafRef = useRef<number | null>(null);
  const targetLevelRef = useRef(0);
  const currentLevelRef = useRef(0);

  // Smooth energy level updates with requestAnimationFrame
  const setEnergyLevel = useCallback((targetLevel: number) => {
    const clamped = Math.max(0, Math.min(100, targetLevel));
    targetLevelRef.current = clamped;
    
    if (rafRef.current === null) {
      setIsTransitioning(true);
      
      const animate = () => {
        const current = currentLevelRef.current;
        const target = targetLevelRef.current;
        const diff = target - current;
        
        if (Math.abs(diff) < 0.1) {
          currentLevelRef.current = target;
          setEnergyLevelState(target);
          setIsTransitioning(false);
          rafRef.current = null;
          return;
        }
        
        // Smooth interpolation with easing
        const step = diff * 0.15; // Adjust speed here
        currentLevelRef.current += step;
        setEnergyLevelState(currentLevelRef.current);
        
        rafRef.current = requestAnimationFrame(animate);
      };
      
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  // Compute theme based on energy level
  const theme = useMemo((): ComputedTheme => {
    // Find surrounding theme levels
    const index = energyLevel / 10;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.min(lowerIndex + 1, ADVANCED_THEMES.length - 1);
    
    const lowerTheme = ADVANCED_THEMES[lowerIndex] || ADVANCED_THEMES[0];
    const upperTheme = ADVANCED_THEMES[upperIndex] || ADVANCED_THEMES[ADVANCED_THEMES.length - 1];
    
    // Calculate interpolation factor with easing
    const factor = (index - lowerIndex);
    const easedFactor = Easing.themeUltraSmooth(factor);
    
    // Interpolate colors in OKLCH space
    const bg = interpolateOKLCH(lowerTheme.bg, upperTheme.bg, easedFactor);
    const text = interpolateOKLCH(lowerTheme.text, upperTheme.text, easedFactor);
    const accent = interpolateOKLCH(lowerTheme.accent, upperTheme.accent, easedFactor);
    
    // Generate derived colors
    const bgSecondary = interpolateOKLCH(bg, text, 0.05);
    const textSecondary = interpolateOKLCH(text, bg, 0.35);
    const border = interpolateOKLCH(text, bg, 0.15);
    
    // Convert to hex
    const bgHex = oklchToHex(bg);
    const textHex = oklchToHex(text);
    const accentHex = oklchToHex(accent);
    const bgSecondaryHex = oklchToHex(bgSecondary);
    const textSecondaryHex = oklchToHex(textSecondary);
    const borderHex = oklchToHex(border);
    
    // Calculate contrast ratio
    const bgRgb = hexToRgb(bgHex);
    const textRgb = hexToRgb(textHex);
    const contrast = getContrastRatio(bgRgb, textRgb);
    
    return {
      bg: bgHex,
      text: textHex,
      accent: accentHex,
      bgSecondary: bgSecondaryHex,
      textSecondary: textSecondaryHex,
      border: borderHex,
      shadow: `rgba(0, 0, 0, ${0.1 + (energyLevel / 100) * 0.3})`,
      contrast,
      wcagAA: meetsWCAG(bgRgb, textRgb, 'AA'),
      wcagAAA: meetsWCAG(bgRgb, textRgb, 'AAA'),
      mood: lowerTheme.mood,
      name: lowerTheme.name,
    };
  }, [energyLevel]);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS variables
    root.style.setProperty('--theme-bg', theme.bg);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-bg-secondary', theme.bgSecondary);
    root.style.setProperty('--theme-text-secondary', theme.textSecondary);
    root.style.setProperty('--theme-border', theme.border);
    root.style.setProperty('--theme-shadow', theme.shadow);
    root.style.setProperty('--theme-contrast', theme.contrast.toFixed(2));
    
    // Set data attributes for debugging
    root.setAttribute('data-theme-name', theme.name);
    root.setAttribute('data-theme-mood', theme.mood);
    root.setAttribute('data-wcag-aa', theme.wcagAA.toString());
    root.setAttribute('data-wcag-aaa', theme.wcagAAA.toString());
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.bg);
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    energyLevel,
    setEnergyLevel,
    isTransitioning,
  }), [theme, energyLevel, setEnergyLevel, isTransitioning]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export theme levels for reference
export { ADVANCED_THEMES };
export type { ThemeLevel, ComputedTheme };
