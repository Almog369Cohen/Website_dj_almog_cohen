import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "על אלמוג כהן | DJ מקצועי 12+ שנות ניסיון | Energy Architect",
  description:
    "אלמוג כהן – DJ מקצועי עם 12+ שנות ניסיון ו-1000+ אירועים. מירושלים לכל הארץ. מנטור ומייסד Compaktt School ללימודי DJ.",
  keywords: [
    "אלמוג כהן DJ",
    "DJ Almog Cohen",
    "DJ מקצועי ירושלים",
    "Energy Architect",
    "DJ לחתונות ניסיון",
    "מנטור DJ",
  ],
  alternates: {
    canonical: "https://www.compaktt.com/about",
  },
  openGraph: {
    title: "על אלמוג כהן | DJ מקצועי – Energy Architect",
    description: "DJ מקצועי עם 12+ שנות ניסיון ו-1000+ אירועים. מנטור ומייסד Compaktt School.",
    type: "profile",
    url: "https://www.compaktt.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
