import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DJ לחתונות יוקרה בישראל | אלמוג כהן – Energy Architect",
  description:
    "הסטנדרט החדש בחתונות. DJ מקצועי לחתונות בוטיק, אפטר פארטי טכנו והתמחות בקהלים מעורבים. מהחופה ועד האפטר – מסע מוזיקלי מדויק.",
  keywords: [
    "DJ לחתונות",
    "דיג'יי לחתונה מומלץ",
    "מוזיקה לחתונה",
    "אפטר פארטי לחתונה",
    "דיג'יי טכנו",
    "חתונות בוטיק",
    "DJ Wedding Israel",
  ],
  openGraph: {
    title: "DJ לחתונות בישראל | אלמוג כהן",
    description: "לא עוד 'שיר אחרי שיר' – מסע מוזיקלי שלם. התמחות בחתונות בוטיק, טכנו והאוס, וקהלים מעורבים.",
    type: "website",
    url: "https://www.compaktt.com/weddings",
  },
};

export default function WeddingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
