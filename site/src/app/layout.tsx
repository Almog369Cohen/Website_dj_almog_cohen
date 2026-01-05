import type { Metadata } from "next";
import { Heebo, Rubik } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { MobileMenu } from "@/components/MobileMenu";
import { DropdownMenu } from "@/components/DropdownMenu";
import { MobileBottomNavLevel1000 } from "@/components/MobileBottomNavLevel1000";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-hebrew-sans",
  subsets: ["hebrew"],
  weight: ["300", "400", "500", "700"],
});

const heebo = Heebo({
  variable: "--font-assistant", // Keeping the variable name to avoid changing globals.css
  subsets: ["hebrew"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DJ לחתונות בישראל | אלמוג כהן – Energy Architect",
  description:
    "DJ Almog Cohen – מחפשים יותר מסתם תקליטן? הכירו את ה-Energy Architect. בניית פסקול מוזיקלי מדויק לחתונות יוקרה, אירועי חברה והפקות ענק. בנוסף: Compakt Academy – בית ספר ל-DJ והפקה מוזיקלית.",
  keywords: [
    "DJ לחתונות",
    "דיג'יי לחתונה מומלץ",
    "מוזיקה לחתונה",
    "DJ תל אביב",
    "אפטר פארטי לחתונה",
    "דיג'יי טכנו",
    "קורס DJ",
    "Compakt Academy",
    "בית ספר DJ",
    "לימודי תקליטנות",
    "DJ לאירועים עסקיים",
    "DJ Almog Cohen",
    "אלמוג כהן Energy Architect",
  ],
  authors: [{ name: "DJ Almog Cohen" }],
  creator: "DJ Almog Cohen",
  publisher: "DJ Almog Cohen",
  metadataBase: new URL("https://www.compaktt.com"),
  alternates: {
    canonical: "https://www.compaktt.com",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://www.compaktt.com",
    siteName: "DJ Almog Cohen – Energy Architect",
    title: "DJ לחתונות בישראל | אלמוג כהן – Energy Architect",
    description:
      "הסטנדרט החדש בחתונות. לא עוד 'שיר אחרי שיר', אלא מסע מוזיקלי שלם. התמחות בקהל מעורב, חתונות קונספט ואירועי בוטיק. בנוסף: Compakt Academy – הכשרה מעשית לדיג'ייז.",
    images: [
      {
        url: "https://www.compaktt.com/assets/almog/IMG_6561.jpg",
        width: 1200,
        height: 630,
        alt: "DJ Almog Cohen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DJ לחתונות בישראל | אלמוג כהן – Energy Architect",
    description:
      "מחפשים DJ לחתונה שיספר את הסיפור שלכם? אדריכלות של אנרגיה: מהחופה ועד האפטר פארטי. התמחות בטכנו, האוס וקהלים מעורבים.",
    images: ["https://www.compaktt.com/assets/almog/IMG_6561.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
    <html lang="he" dir="rtl" suppressHydrationWarning className="dark">
      <head />
      <body suppressHydrationWarning className={`${rubik.variable} ${heebo.variable} antialiased bg-background text-foreground`}>
        <a href="#main-content" className="skip-to-content">
          דלג לתוכן הראשי
        </a>
        <ThemeProvider>
        <div className="min-h-dvh flex flex-col">
          <header className="glass-section sticky top-0 z-40" role="banner">
            <div className="mx-auto w-full max-w-6xl px-4 py-2.5 md:py-3">
              <div className="flex items-center justify-between">
                {/* Right Side: Mobile Menu & Theme */}
                <div className="flex items-center gap-3">
                  <MobileMenu waNumber={waNumber} waText={waText} />
                  <ThemeToggle />
                </div>

                {/* Center: Logo - takes its own space */}
                <div className="flex items-center justify-center px-4 md:px-8">
                  <Link href="/" aria-label="חזרה לדף הבית" className="flex items-center">
                    <Image 
                      src="/assets/logo/icon-white.png" 
                      alt="DJ Almog Cohen" 
                      width={40} 
                      height={40} 
                      className="h-7 w-auto md:h-10 object-contain hover:opacity-90 transition-opacity max-h-[28px] md:max-h-[40px]"
                      priority
                    />
                  </Link>
                </div>

                {/* Left Side: Desktop Nav */}
                <nav className="hidden gap-4 lg:gap-5 text-sm md:flex items-center" role="navigation" aria-label="תפריט ראשי">
                  <DropdownMenu
                    title="חתונות"
                    mainHref="/weddings"
                    items={[
                      { label: "בדיקת התאמה", href: "/weddings/fit-check", color: "from-[#059cc0] to-[#03b28c]" },
                      { label: "אפטר פארטי", href: "/weddings/after-party", color: "from-purple-500 to-pink-500" },
                      { label: "LIVE ON DJ", href: "/events/live-on-dj", color: "from-purple-500 to-violet-500" },
                      { label: "חתן מתקלט", href: "/academy/groom-dj", color: "from-pink-400 to-rose-400" },
                    ]}
                  />
                  <DropdownMenu
                    title="Academy"
                    mainHref="/academy"
                    clickOnly={true}
                    items={[
                      { label: "קורס DJ למתחילים", href: "/academy/dj-course", color: "from-[#059cc0] to-[#03b28c]" },
                      { label: "תכנית פרמיום", href: "/academy/premium", color: "from-[#ffaa00] to-orange-500" },
                      { label: "חתן מתקלט", href: "/academy/groom-dj", color: "from-pink-400 to-rose-400" },
                    ]}
                  />
                  <Link href="/chogeg-menagen" className="hover:text-brand-green">חוגג מנגן</Link>
                  <Link href="/music" className="hover:text-brand-blue">מוזיקה</Link>
                  <Link href="/playlists" className="hover:text-brand-green">פלייליסטים</Link>
                  <Link href="/blog" className="hover:text-brand-blue">בלוג</Link>
                  <Link href="/about" className="hover:text-brand-blue">אודות</Link>
                  <a
                    href={`https://wa.me/${waNumber}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-brand-blue px-4 py-2 text-white hover:opacity-90"
                  >
                    צור קשר
                  </a>
                </nav>
                
                {/* Spacer for mobile layout balance */}
                <div className="w-10 md:hidden" aria-hidden="true" />
              </div>
            </div>
          </header>
          <main id="main-content" className="flex-1" role="main">{children}</main>
          <AccessibilityMenu />
          <footer className="glass-panel border-t" role="contentinfo">
            <div className="mx-auto w-full max-w-6xl px-4 py-6">
              {/* Academy */}
              <div className="mb-4 text-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">Compakt Academy</h3>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-foreground-secondary">
                  <Link href="/academy" className="hover:text-brand-blue transition">קורסים ומנטורינג</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/academy/dj-course" className="hover:text-brand-blue transition">קורס DJ</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/academy/premium" className="hover:text-brand-blue transition">תכנית פרמיום</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/academy/groom-dj" className="hover:text-brand-blue transition">חתן מתקלט</Link>
                </div>
              </div>

              {/* Events */}
              <div className="mb-4 text-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-2">חתונות</h3>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-foreground-secondary">
                  <Link href="/weddings" className="hover:text-brand-green transition">עמוד חתונות</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/weddings/fit-check" className="hover:text-brand-green transition">בדיקת התאמה</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/weddings/after-party" className="hover:text-brand-green transition">אפטר פארטי</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/events/live-on-dj" className="hover:text-brand-green transition">LIVE ON DJ</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/academy/groom-dj" className="hover:text-brand-green transition">חתן מתקלט</Link>
                </div>
              </div>

              {/* About */}
              <div className="mb-4 text-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground-heading mb-2">אודות</h3>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-foreground-secondary">
                  <Link href="/about" className="hover:text-foreground-heading transition">על אלמוג כהן</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/blog" className="hover:text-foreground-heading transition">בלוג</Link>
                  <span className="text-white/20">•</span>
                  <Link href="/music" className="hover:text-foreground-heading transition">מוזיקה</Link>
                  <span className="text-white/20">•</span>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-green transition">צור קשר</a>
                </div>
              </div>

              <div className="border-t border-border pt-4 text-center text-xs text-foreground-secondary">
                <p>© {new Date().getFullYear()} DJ Almog Cohen – Energy Architect</p>
                <p className="text-muted-foreground mt-1">מוזיקה • יצירה • מנטורינג</p>
              </div>
            </div>
          </footer>
        </div>
        </ThemeProvider>
        
        {/* Mobile Bottom Navigation - Level 1000 */}
        <MobileBottomNavLevel1000 />
        
        {/* Desktop WhatsApp Button (hidden on mobile - nav handles it) */}
        <a
          href={`https://wa.me/${waNumber}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button fixed bottom-4 left-4 z-50 px-5 py-3 text-sm font-medium text-foreground-heading focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-background hidden md:block"
          aria-label="פתיחת שיחה בוואטסאפ"
        >
          WhatsApp
        </a>
      </body>
    </html>
  );
}
