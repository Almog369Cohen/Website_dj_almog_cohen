import type { Metadata, Viewport } from "next";
import { Bellefair, Heebo } from "next/font/google";
import { brand, whatsapp } from "@/content/site";
import { pages } from "@/content/routes";
import { Header } from "@/components/Header";
import { Engine } from "@/components/Engine";
import { Consent } from "@/components/Consent";
import { JsonLd, WaIcon } from "@/components/ui";
import { orgGraph, pageMetadata } from "@/lib/seo";
import { waHref } from "@/lib/whatsapp";
import "./globals.css";

const bellefair = Bellefair({ variable: "--font-bellefair", subsets: ["hebrew", "latin"], weight: "400", display: "swap" });
const heebo = Heebo({ variable: "--font-heebo", subsets: ["hebrew", "latin"], weight: ["300", "400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  ...pageMetadata(pages.home),
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b0a0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before first paint: pinned scenes only when motion is welcome and the screen is tall enough.
const scenesScript = `(function(){var h=document.documentElement,m=function(q){return window.matchMedia&&matchMedia(q).matches};h.dataset.scenes=m('(prefers-reduced-motion: reduce)')||m('(orientation: landscape) and (max-height: 500px)')?'off':'on'})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" data-scenes="off" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scenesScript }} />
      </head>
      <body className={`${bellefair.variable} ${heebo.variable}`}>
        <a className="skip" href="#main">דלגו לתוכן</a>
        <Header />
        {children}
        <a className="fab" id="fab" href={waHref()} target="_blank" rel="noopener" data-wa-link="fab" aria-label={`${whatsapp.cta} בוואטסאפ`}>
          <WaIcon />
        </a>
        <Consent />
        <Engine />
        <JsonLd data={{ "@context": "https://schema.org", "@graph": orgGraph() }} />
      </body>
    </html>
  );
}
