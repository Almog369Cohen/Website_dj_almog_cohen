/**
 * useHaptic - Hook for haptic feedback on mobile devices
 * Uses the Vibration API when available
 */

type VibratePattern = number | number[];

interface HapticOptions {
  /** Light tap - quick feedback (default: 10ms) */
  light: VibratePattern;
  /** Medium tap - button press (default: 15ms) */
  medium: VibratePattern;
  /** Heavy tap - important action (default: 25ms) */
  heavy: VibratePattern;
  /** Success pattern - task completed */
  success: VibratePattern;
  /** Error pattern - something went wrong */
  error: VibratePattern;
  /** Warning pattern - attention needed */
  warning: VibratePattern;
}

const defaultPatterns: HapticOptions = {
  light: 10,
  medium: 15,
  heavy: 25,
  success: [10, 50, 20],
  error: [50, 30, 50],
  warning: [20, 20, 20],
};

/**
 * Check if vibration is supported
 */
const isVibrationSupported = (): boolean => {
  return typeof window !== "undefined" && "vibrate" in navigator;
};

/**
 * Trigger vibration with a pattern
 */
const vibrate = (pattern: VibratePattern = 10): boolean => {
  if (!isVibrationSupported()) return false;
  
  try {
    return navigator.vibrate(pattern);
  } catch (e) {
    console.warn("Vibration failed:", e);
    return false;
  }
};

/**
 * Stop any ongoing vibration
 */
const stop = (): boolean => {
  if (!isVibrationSupported()) return false;
  return navigator.vibrate(0);
};

export function useHaptic(customPatterns?: Partial<HapticOptions>) {
  const patterns = { ...defaultPatterns, ...customPatterns };

  return {
    /** Check if haptic feedback is available */
    isSupported: isVibrationSupported(),
    
    /** Light tap feedback */
    light: () => vibrate(patterns.light),
    
    /** Medium tap feedback */
    medium: () => vibrate(patterns.medium),
    
    /** Heavy tap feedback */
    heavy: () => vibrate(patterns.heavy),
    
    /** Success feedback pattern */
    success: () => vibrate(patterns.success),
    
    /** Error feedback pattern */
    error: () => vibrate(patterns.error),
    
    /** Warning feedback pattern */
    warning: () => vibrate(patterns.warning),
    
    /** Custom vibration pattern */
    vibrate,
    
    /** Stop any ongoing vibration */
    stop,
  };
}

export default useHaptic;
