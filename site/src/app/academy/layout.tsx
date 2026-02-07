import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compaktt School – לימודי DJ מקצועיים | אלמוג כהן",
  description:
    "Compaktt School: מסלולי לימוד DJ מקצועיים – מחבילת בסיס ועד מסלול PRO עם יציאה לאירועים אמיתיים. ציוד XDJ-RX3, DDJ-1000, ליווי אישי עם אלמוג כהן.",
  keywords: [
    "לימודי DJ",
    "קורס DJ",
    "Compaktt School",
    "לימודי תקליטנות",
    "DJ מקצועי",
    "חתן מתקלט",
    "XDJ-RX3",
    "DDJ-1000",
  ],
  openGraph: {
    title: "Compaktt School – לימודי DJ מקצועיים",
    description: "מסלולי לימוד DJ מקצועיים – מ-0 לעמדה מקצועית עם ציוד, ליווי ואירוע אמיתי.",
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
