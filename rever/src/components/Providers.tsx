"use client";

import { MotionConfig } from "framer-motion";

/** Every Framer animation honours the device's "reduce motion" setting. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
