// PERFORMANCE-OPTIMIZATION.tsx
// אופטימיזציות ביצועים מותאמות למותג DJ Almog Cohen

import { lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// ===========================================
// 1. LAZY LOADING COMPONENTS
// ===========================================

// טעינה עצלה של קומפוננטות כבדות
const WeddingsLevel100 = lazy(() => 
  import('../components/WeddingsLevel100').then(module => ({
    default: module.WeddingsLevel100
  }))
);

const ChogegMenagenLevel100 = lazy(() => 
  import('../components/ChogegMenagenLevel100').then(module => ({
    default: module.ChogegMenagenLevel100
  }))
);

// ===========================================
// 2. OPTIMIZED MOTION CONFIG
// ===========================================

// הגדרות אנימציה מותאמות למותג
export const brandMotionConfig = {
  // אנימציות מובייל מופחתות
  mobile: {
    duration: 0.3,
    ease: "easeOut",
    reduce: true
  },
  
  // אנימציות דסקטופ מלאות
  desktop: {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94],
    reduce: false
  },
  
  // אנימציות למותג (כחול-ירוק)
  brand: {
    colors: {
      blue: "#059cc0",
      green: "#03b28c",
      cyan: "#22d3ee"
    },
    glow: "0 0 20px rgba(5, 156, 192, 0.4)",
    shadow: "0 4px 20px rgba(3, 178, 140, 0.3)"
  }
};

// ===========================================
// 3. PERFORMANCE HOOKS
// ===========================================

// Hook לאופטימיזציית אנימציות
export const useOptimizedAnimation = (isMobile: boolean) => {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion || isMobile) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 }
    };
  }
  
  return {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      type: "spring",
      stiffness: 100
    }
  };
};

// Hook לאופטימיזציית תמונות
export const useImageOptimization = () => {
  return {
    loading: "lazy" as const,
    quality: 85,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    placeholder: "blur" as const
  };
};

// ===========================================
// 4. OPTIMIZED COMPONENTS
// ===========================================

// קומפוננטת סקשן מותאמת ביצועים
export const OptimizedSection = ({ 
  id, 
  children, 
  className = "",
  useFadeMask = false,
  isMobile = false 
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  useFadeMask?: boolean;
  isMobile?: boolean;
}) => {
  const animationConfig = useOptimizedAnimation(isMobile);
  
  return (
    <motion.section
      id={id}
      {...animationConfig}
      viewport={{ once: true, margin: "-10%" }}
      className={`relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24 ${className}`}
    >
      {/* Fade Mask Level 500 מותנה */}
      {useFadeMask && (
        <div className="fade-mask-premium" />
      )}
      
      {children}
    </motion.section>
  );
};

// כותרת מותאמת ביצועים עם צבעי מותג
export const OptimizedBrandHeading = ({ 
  children, 
  level = "h2",
  gradient = "blue-green",
  isMobile = false 
}: {
  children: React.ReactNode;
  level?: "h1" | "h2" | "h3";
  gradient?: "blue-green" | "cyan-blue" | "green-blue";
  isMobile?: boolean;
}) => {
  const Component = level;
  const animationConfig = useOptimizedAnimation(isMobile);
  
  const gradientClasses = {
    "blue-green": "bg-gradient-to-r from-brand-blue via-white to-brand-green",
    "cyan-blue": "bg-gradient-to-r from-cyan-400 via-white to-blue-400", 
    "green-blue": "bg-gradient-to-r from-brand-green via-white to-brand-blue"
  };
  
  return (
    <motion.div {...animationConfig}>
      <Component className={`
        ${gradientClasses[gradient]} 
        bg-clip-text text-transparent font-black
        ${level === 'h1' ? 'text-4xl md:text-6xl' : ''}
        ${level === 'h2' ? 'text-3xl md:text-5xl' : ''}
        ${level === 'h3' ? 'text-2xl md:text-4xl' : ''}
        drop-shadow-md
      `}>
        {children}
      </Component>
    </motion.div>
  );
};

// ===========================================
// 5. PERFORMANCE MONITORING
// ===========================================

// פונקציה למדידת ביצועים
export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      // Core Web Vitals
      FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      LCP: 0, // יימדד בנפרד
      CLS: 0, // יימדד בנפרד
      
      // Loading times
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      loadComplete: navigation.loadEventEnd - navigation.navigationStart,
      
      // Network
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseStart - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart
    };
  }
  
  return null;
};

// ===========================================
// 6. OPTIMIZED ANIMATIONS CONFIG
// ===========================================

// הגדרות אנימציה לפי דרישות המותג
export const brandAnimations = {
  // הופעת איטור עדין (למותג יוקרתי)
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  
  // אפקט זוהר למותג
  brandGlow: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(5, 156, 192, 0.3)",
        "0 0 30px rgba(3, 178, 140, 0.5)", 
        "0 0 20px rgba(5, 156, 192, 0.3)"
      ]
    },
    transition: { duration: 2, repeat: Infinity }
  },
  
  // סיבוב עדין לאייקונים
  gentleRotate: {
    animate: { rotate: [0, 360] },
    transition: { duration: 8, repeat: Infinity, ease: "linear" }
  },
  
  // פעימה עדינה
  gentlePulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

// ===========================================
// 7. MOBILE-FIRST OPTIMIZATION
// ===========================================

export const mobileOptimizations = {
  // הפחתת אנימציות במובייל
  animations: {
    duration: 0.3,
    easing: "ease-out",
    disable: ["rotate", "scale", "complex-paths"]
  },
  
  // אופטימיזציית תמונות למובייל
  images: {
    quality: 75,
    format: "webp",
    sizes: "100vw",
    loading: "lazy"
  },
  
  // הפחתת אפקטים במובייל
  effects: {
    blur: "reduced",
    shadows: "minimal", 
    gradients: "simplified"
  }
};

export default {
  brandMotionConfig,
  useOptimizedAnimation,
  useImageOptimization,
  OptimizedSection,
  OptimizedBrandHeading,
  measurePerformance,
  brandAnimations,
  mobileOptimizations
};
