import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "פלייליסטים לחתונה | שירי חופה, סלואו, רחבה | DJ אלמוג כהן",
  description:
    "פלייליסטים מקצועיים לחתונה מחולקים לפי רגעים: שירי כניסה לחופה, שבירת כוס, סלואו ושיר סיום. עברית ואנגלית – מ-DJ עם 1000+ חתונות.",
  keywords: [
    "פלייליסט לחתונה",
    "שירים לחתונה",
    "שירי חופה",
    "מוזיקה לחתונה",
    "שירים לרחבה",
    "סלואו לחתונה",
    "שירי שבירת כוס",
  ],
  alternates: {
    canonical: "https://www.compaktt.com/music",
  },
  openGraph: {
    title: "פלייליסטים לחתונה | DJ אלמוג כהן",
    description: "שירי חופה, סלואו, רחבה ושבירת כוס – פלייליסטים מקצועיים לחתונה.",
    type: "website",
    url: "https://www.compaktt.com/music",
  },
};

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
