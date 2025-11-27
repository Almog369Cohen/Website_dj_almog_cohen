import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compakt Academy – בית ספר לדיג'ייז | DJ Almog Cohen",
  description:
    "Compakt Academy: קורס DJ למתחילים, תכנית מנטורינג פרמיום לבניית קריירה בתחום הלילה, וחתן מתקלט. הכשרה מעשית על ציוד Pioneer מקצועי עם אלמוג כהן.",
  keywords: [
    "קורס DJ",
    "בית ספר DJ",
    "לימודי תקליטנות",
    "Compakt Academy",
    "מנטורינג לדיג'ייז",
    "חתן מתקלט",
    "אטרקציה לחתונה",
  ],
  openGraph: {
    title: "Compakt Academy – בית ספר לדיג'ייז",
    description: "קורס DJ למתחילים, תכנית מנטורינג פרמיום, וחתן מתקלט. הכשרה מעשית עם אלמוג כהן.",
    type: "website",
    url: "https://www.compaktt.com/academy",
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
