import type { Metadata } from "next";
import { Assistant, Noto_Sans_Hebrew } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const hebrew = Noto_Sans_Hebrew({
  variable: "--font-hebrew-sans",
  subsets: ["hebrew"],
  weight: ["400", "500", "700"],
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DJ Almog Cohen — DJ • Mentor • Creator",
  description:
    "Premium DJ brand site. Events, DJ courses & mentorship. Energy, emotion, and human connection through sound.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "DJ Almog Cohen",
    description:
      "Events, DJ courses & mentorship. Energy, emotion, and human connection through sound.",
    type: "website",
    url: "https://example.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const waText = encodeURIComponent(
    "היי אלמוג, הייתי באתר שלך ואני רוצה לדבר על אירוע/קורס."
  );
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${hebrew.variable} ${assistant.variable} antialiased bg-background text-foreground`}>
        <div className="min-h-dvh flex flex-col">
          <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/60">
            <div className="mx-auto w-full max-w-6xl px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold text-brand-blue">
                  DJ Almog Cohen
                </Link>
                <nav className="hidden gap-6 text-sm md:flex">
                  <Link href="/services" className="hover:text-brand-blue">שירותים</Link>
                  <Link href="/chogeg-menagen" className="hover:text-brand-green">חוגג מנגן</Link>
                  <Link href="/music" className="hover:text-brand-blue">מוזיקה</Link>
                  <Link href="/blog" className="hover:text-brand-blue">בלוג</Link>
                  <Link href="/about" className="hover:text-brand-blue">אודות</Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-brand-blue px-4 py-2 text-black hover:opacity-90"
                  >
                    צור קשר
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 bg-black/70">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-white/70">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} DJ Almog Cohen</p>
                <p className="text-white/50">מוזיקה • יצירה • מנטורינג</p>
              </div>
            </div>
          </footer>
        </div>
        <a
          href={`https://wa.me/${waNumber}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 left-4 z-50 rounded-full bg-gradient-to-r from-brand-blue to-brand-green px-5 py-3 text-sm font-medium text-black shadow-lg hover:opacity-90"
        >
          WhatsApp
        </a>
      </body>
    </html>
  );
}
