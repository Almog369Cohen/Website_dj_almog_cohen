"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const Home2026V5RealContent = dynamic(() => import("@/components/home/styles/Home2026V5RealContent"), { ssr: false });

export default function PreviewHomeV5aPage() {
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const actionable = target.closest("a,button") as HTMLElement | null;
      if (!actionable) return;
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  return <Home2026V5RealContent />;
}
