/**
 * Advanced Easing Functions - Level 1000
 * For smooth, professional animations
 */

export type EasingFunction = (t: number) => number;

/**
 * Cubic Bezier easing (same as CSS cubic-bezier)
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): EasingFunction {
  return (t: number) => {
    // Simplified cubic bezier calculation
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    const t2 = t * t;
    const t3 = t2 * t;
    
    return ay * t3 + by * t2 + cy * t;
  };
}

// Common easing presets
export const Easing = {
  // Linear
  linear: (t: number) => t,
  
  // Ease In
  easeInQuad: (t: number) => t * t,
  easeInCubic: (t: number) => t * t * t,
  easeInQuart: (t: number) => t * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeInExpo: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeInCirc: (t: number) => 1 - Math.sqrt(1 - t * t),
  
  // Ease Out
  easeOutQuad: (t: number) => t * (2 - t),
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeOutCirc: (t: number) => Math.sqrt(1 - (--t) * t),
  
  // Ease In Out
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInOutQuint: (t: number) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return t < 0.5 
      ? Math.pow(2, 20 * t - 10) / 2 
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
  easeInOutCirc: (t: number) => {
    return t < 0.5
      ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
      : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
  },
  
  // Elastic & Bounce
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  
  // Custom - Material Design
  materialStandard: cubicBezier(0.4, 0.0, 0.2, 1),
  materialDecelerate: cubicBezier(0.0, 0.0, 0.2, 1),
  materialAccelerate: cubicBezier(0.4, 0.0, 1, 1),
  
  // Custom - iOS
  iosStandard: cubicBezier(0.25, 0.1, 0.25, 1),
  
  // Custom - For theme transitions (ultra smooth)
  themeSmooth: cubicBezier(0.4, 0.0, 0.2, 1),
  themeUltraSmooth: cubicBezier(0.33, 0.0, 0.15, 1),
};

/**
 * Spring physics simulation
 */
export function spring(
  stiffness: number = 100,
  damping: number = 10,
  mass: number = 1
): EasingFunction {
  return (t: number) => {
    const w = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    
    if (zeta < 1) {
      // Underdamped
      const wd = w * Math.sqrt(1 - zeta * zeta);
      return 1 - Math.exp(-zeta * w * t) * Math.cos(wd * t);
    } else if (zeta === 1) {
      // Critically damped
      return 1 - Math.exp(-w * t) * (1 + w * t);
    } else {
      // Overdamped
      return 1 - Math.exp(-zeta * w * t);
    }
  };
}
