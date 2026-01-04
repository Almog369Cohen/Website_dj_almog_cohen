import type { Metadata } from "next";
import EventsLayoutShell from "@/components/events/EventsLayoutShell";

export const metadata: Metadata = {
  title: "שירותי DJ לאירועים | אלמוג כהן – Energy Architect",
  description:
    "DJ מקצועי לכל סוגי האירועים: חתונות, בר/בת מצווה, חינה והופעות LIVE ON DJ. 12 שנות ניסיון בהפקות מוזיקליות לאירועים בכל רחבי ישראל.",
  keywords: [
    "DJ לאירועים",
    "DJ לחתונות",
    "DJ לבר מצווה",
    "DJ לבת מצווה",
    "DJ לחינה",
    "LIVE ON DJ",
    "דיג'יי מומלץ",
    "אלמוג כהן DJ",
  ],
  openGraph: {
    title: "שירותי DJ לאירועים | אלמוג כהן",
    description: "DJ מקצועי לחתונות, בר/בת מצווה, חינה והופעות LIVE. כל אירוע מקבל את הפסקול המושלם שלו.",
    type: "website",
    url: "https://www.compaktt.com/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EventsLayoutShell>{children}</EventsLayoutShell>;
}
