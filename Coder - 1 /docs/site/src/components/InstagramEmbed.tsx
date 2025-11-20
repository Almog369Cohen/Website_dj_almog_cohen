"use client";
import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

export default function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.instgrm?.Embeds?.process?.();
    }
  }, [url]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ margin: 0, maxWidth: "540px", width: "100%" }}
      />
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
    </div>
  );
}
