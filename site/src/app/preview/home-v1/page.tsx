"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const HomeBridalGlass = dynamic(() => import("@/components/home/styles/HomeBridalGlass"), { ssr: false });

export default function PreviewHomeV1Page() {
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

  return <HomeBridalGlass />;
}
