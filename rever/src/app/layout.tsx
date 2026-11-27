import type { Metadata, Viewport } from "next";
import { Assistant } from "next/font/google";
import { brand } from "@/content/site";
import { pages } from "@/content/routes";
import { Header } from "@/components/Header";
import { Engine } from "@/components/Engine";
import { Consent } from "@/components/Consent";
import { JsonLd } from "@/components/ui";
import { ConsultFab } from "@/components/Consult";
import { orgGraph, pageMetadata } from "@/lib/seo";
import "./globals.css";

// RULES.md §1: Assistant only, 300 for everything and 700 for key words.
const assistant = Assistant({ variable: "--font-assistant", subsets: ["hebrew", "latin"], weight: ["300", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  ...pageMetadata(pages.home),
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0f0d0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: pinned scenes only when motion is welcome and the screen is tall enough.
const scenesScript = `(function(){var h=document.documentElement,m=function(q){return window.matchMedia&&matchMedia(q).matches};h.dataset.scenes=m('(prefers-reduced-motion: reduce)')||m('(orientation: landscape) and (max-height: 500px)')?'off':'on'})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" data-scenes="off" className={assistant.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scenesScript }} />
      </head>
      <body>
        <a className="skip" href="#main">דלגו לתוכן</a>
        <Header />
        {children}
        <ConsultFab />
        <Consent />
        <Engine />
        <JsonLd data={{ "@context": "https://schema.org", "@graph": orgGraph() }} />
      </body>
    </html>
  );
}
