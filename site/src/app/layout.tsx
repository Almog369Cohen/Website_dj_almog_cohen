import type { Metadata } from "next";
import { Heebo, Rubik } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { MobileMenu } from "@/components/MobileMenu";
import { DropdownMenu } from "@/components/DropdownMenu";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const effectiveTheme = theme === 'system' ? systemTheme : theme;
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(effectiveTheme || 'dark');
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${rubik.variable} ${heebo.variable} antialiased bg-background text-foreground`}>
        <a href="#main-content" className="skip-to-content">
          דלג לתוכן הראשי
        </a>
        <ThemeProvider>
        <div className="min-h-dvh flex flex-col">
          <header className="glass-section sticky top-0 z-40" role="banner">
            <div className="mx-auto w-full max-w-6xl px-4 py-2.5 md:py-3">
              <div className="relative flex items-center justify-between gap-4">
                {/* Right Side (Start): Mobile Menu & Theme */}
                <div className="flex items-center gap-3">
                  <MobileMenu waNumber={waNumber} waText={waText} />
                  <ThemeToggle />
                </div>

                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
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

                {/* Left Side (End): Desktop Nav */}
                <nav className="hidden gap-6 text-sm md:flex items-center" role="navigation" aria-label="תפריט ראשי">
                  <DropdownMenu
                    title="אירועים"
                    mainHref="/events"
                    items={[
                      { label: "DJ חתונות", href: "/events/weddings-dj", color: "from-[#059cc0] to-[#03b28c]" },
                      { label: "DJ בר מצווה", href: "/events/bar-mitzvah-dj", color: "from-blue-500 to-cyan-500" },
                      { label: "DJ בת מצווה", href: "/events/bat-mitzvah-dj", color: "from-pink-500 to-rose-500" },
                      { label: "DJ חינה", href: "/events/henna-dj", color: "from-amber-500 to-orange-500" },
                      { label: "אירועים עסקיים", href: "/events/corporate-events", color: "from-indigo-500 to-blue-600" },
                      { label: "חוגג מנגן", href: "/events/chogeg-menagen", color: "from-[#03b28c] to-emerald-500" },
                      { label: "LIVE ON DJ", href: "/events/live-on-dj", color: "from-purple-500 to-violet-500" },
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
            <div className="mx-auto w-full max-w-6xl px-4 py-12">
              <div className="grid gap-8 md:grid-cols-3">
                {/* Academy */}
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-blue">Compakt Academy</h3>
                  <nav className="flex flex-col gap-2 text-sm text-foreground-secondary">
                    <Link href="/academy" className="hover:text-foreground-heading transition">קורסים ומנטורינג</Link>
                    <Link href="/academy/dj-course" className="hover:text-foreground-heading transition">קורס DJ למתחילים</Link>
                    <Link href="/academy/premium" className="hover:text-foreground-heading transition">תכנית פרמיום</Link>
                    <Link href="/academy/groom-dj" className="hover:text-foreground-heading transition">חתן מתקלט</Link>
                  </nav>
                </div>

                {/* Events & Services */}
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-green">אירועים</h3>
                  <nav className="flex flex-col gap-2 text-sm text-foreground-secondary">
                    <Link href="/events" className="hover:text-foreground-heading transition">כל האירועים</Link>
                    <Link href="/events/weddings-dj" className="hover:text-foreground-heading transition">DJ חתונות</Link>
                    <Link href="/events/bar-mitzvah-dj" className="hover:text-foreground-heading transition">DJ בר מצווה</Link>
                    <Link href="/events/bat-mitzvah-dj" className="hover:text-foreground-heading transition">DJ בת מצווה</Link>
                    <Link href="/events/henna-dj" className="hover:text-foreground-heading transition">DJ חינה</Link>
                    <Link href="/events/corporate-events" className="hover:text-foreground-heading transition">אירועים עסקיים</Link>
                    <Link href="/events/chogeg-menagen" className="hover:text-foreground-heading transition">חוגג מנגן</Link>
                    <Link href="/events/live-on-dj" className="hover:text-foreground-heading transition">LIVE ON DJ</Link>
                  </nav>
                </div>

                {/* About */}
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground-heading">אודות</h3>
                  <nav className="flex flex-col gap-2 text-sm text-foreground-secondary">
                    <Link href="/about" className="hover:text-foreground-heading transition">על אלמוג כהן</Link>
                    <Link href="/blog" className="hover:text-foreground-heading transition">בלוג</Link>
                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground-heading transition">צור קשר</a>
                  </nav>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-foreground-secondary">
                <p>© {new Date().getFullYear()} DJ Almog Cohen – Energy Architect</p>
                <p className="text-muted-foreground">מוזיקה • יצירה • מנטורינג</p>
              </div>
            </div>
          </footer>
        </div>
        </ThemeProvider>
        <a
          href={`https://wa.me/${waNumber}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button fixed bottom-4 left-4 z-50 px-5 py-3 text-sm font-medium text-foreground-heading focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-background md:block hidden"
          aria-label="פתיחת שיחה בוואטסאפ"
        >
          WhatsApp
        </a>
        <a
          href={`https://wa.me/${waNumber}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button fixed bottom-4 left-4 z-50 flex h-14 w-14 items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-background md:hidden"
          aria-label="פתיחת שיחה בוואטסאפ"
        >
          <svg className="h-6 w-6 text-foreground-heading" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}
