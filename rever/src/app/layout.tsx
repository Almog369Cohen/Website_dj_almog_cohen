import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { brand } from "@/content/site";
import { Providers } from "@/components/Providers";
import "./globals.css";

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
});

const title = "ריבר הפקות | הפקת חתונות ואירועים | REVER";
const description =
  "REVER מפיקה חתונות ואירועים כבר 6 שנים: לוקיישן וספקים, תכנון ותקציב, עיצוב וניהול מלא של יום האירוע. השאירו פרטים ונחזור אליכם.";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title,
  description,
  keywords: ["הפקת אירועים", "מפיק אירועים", "הפקת חתונה", "הפקת בר מצווה", "הפקת אירועי חברה", "REVER PRODUCTIONS", "ריבר הפקות"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: brand.url,
    siteName: brand.fullName,
    title,
    description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: brand.fullName }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/og.jpg"] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0e0c0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EventPlanner",
  name: brand.fullName,
  alternateName: brand.nameHe,
  url: brand.url,
  telephone: `+${brand.phoneIntl}`,
  image: `${brand.url}/images/og.jpg`,
  logo: `${brand.url}/images/logo.png`,
  sameAs: [brand.instagram],
  areaServed: "IL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${frank.variable} ${heebo.variable} antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-bg">
          דלג לתוכן
        </a>
        <Providers>{children}</Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
