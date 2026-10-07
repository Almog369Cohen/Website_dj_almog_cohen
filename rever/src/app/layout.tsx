import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { brand } from "@/content/site";
import "./globals.css";

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "800"],
});

const title = `${brand.fullName} | ניהול והפקת אירועים מקצה לקצה`;
const description =
  "Rever הפקות אירועים — ניהול והפקה של חתונות, בר/בת מצווה, אירועי חברה ואירועים פרטיים. קונספט, סאונד, תאורה, מסכים, עיצוב וצוות שטח תחת קורת גג אחת.";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title,
  description,
  keywords: ["הפקת אירועים", "הפקות אירועים רמת גן", "מפיק אירועים", "הפקת חתונה", "הפקת בר מצווה", "הפקת אירועי חברה", "Rever", "ריבר הפקות"],
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
  themeColor: "#07060a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EventPlanner",
  name: brand.fullName,
  alternateName: brand.nameHe,
  url: brand.url,
  telephone: `+${brand.phoneIntl}`,
  image: `${brand.url}/images/og.jpg`,
  address: { "@type": "PostalAddress", addressLocality: brand.city, addressCountry: "IL" },
  areaServed: "IL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${frank.variable} ${heebo.variable} grain antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-bg">
          דלג לתוכן
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
