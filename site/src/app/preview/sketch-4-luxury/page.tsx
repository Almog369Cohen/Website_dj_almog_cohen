"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const HomeSketch4Luxury = dynamic(() => import("@/components/home/sketches/HomeSketch4Luxury"), { ssr: false });

export default function PreviewSketch4Page() {
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const actionable = target.closest("a,button") as HTMLElement | null;
      if (!actionable) return;
      
      const href = actionable.getAttribute("href");
      if (href && (href.startsWith("https://wa.me") || href.startsWith("tel:") || href.startsWith("https://youtu"))) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  return <HomeSketch4Luxury />;
}
