"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { initSource } from "@/lib/source";

/** Every Framer animation honours the device's "reduce motion" setting; the visit's source is noted once. */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(initSource, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
