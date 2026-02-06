import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DJ לחתונה | אלמוג כהן – 1000+ חתונות | רחבה מלאה מובטחת",
  description:
    "DJ מקצועי לחתונות בישראל עם 10+ שנות ניסיון ו-1000+ אירועים. ליווי אישי מהתכנון ועד הרחבה, תזמון מדויק, התאמה לקהל מעורב. שירי חופה, שבירת כוס, סלואו ורחבה מטורפת.",
  keywords: [
    "DJ לחתונה",
    "דיג'יי לחתונה",
    "DJ לחתונות",
    "דיג'יי לחתונה מומלץ",
    "תקליטן לחתונה",
    "מוזיקה לחתונה",
    "שירים לחתונה",
    "שירי חופה",
    "שירים לרחבה בחתונה",
    "DJ חתונה מחיר",
    "אפטר פארטי לחתונה",
    "DJ מומלץ לחתונה 2025",
    "דיג'יי לאירועים",
    "DJ Wedding Israel",
  ],
  alternates: {
    canonical: "https://www.compaktt.com/weddings",
  },
  openGraph: {
    title: "DJ לחתונה | אלמוג כהן – רחבה מלאה מובטחת",
    description: "DJ מקצועי לחתונות עם 10+ שנות ניסיון. ליווי אישי, תזמון מדויק, והתאמה לכל קהל. 1000+ זוגות מרוצים.",
    type: "website",
    url: "https://www.compaktt.com/weddings",
    images: [
      {
        url: "https://www.compaktt.com/assets/gallery/djavira/entrance.jpg",
        width: 1200,
        height: 630,
        alt: "DJ אלמוג כהן בחתונה - כניסה לחופה",
      },
    ],
  },
};

export default function WeddingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
