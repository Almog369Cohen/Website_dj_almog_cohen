"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const HomeSketch1Pro = dynamic(() => import("@/components/home/sketches/HomeSketch1Pro"), { ssr: false });

export default function PreviewSketch1ProPage() {
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

  return <HomeSketch1Pro />;
}
