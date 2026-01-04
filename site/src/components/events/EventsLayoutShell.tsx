"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { EventsStickyCTA } from "@/components/events/EventsStickyCTA";
import { getEventsWhatsAppMessage, WhatsAppTemplateKey } from "@/utils/whatsapp";

function getTemplateKeyFromPath(pathname: string): WhatsAppTemplateKey {
  if (pathname.includes("/events/weddings-dj")) return "weddings_dj";
  if (pathname.includes("/events/corporate-events")) return "corporate_events";
  if (pathname.includes("/events/bar-mitzvah-dj")) return "bar_mitzvah";
  if (pathname.includes("/events/bat-mitzvah-dj")) return "bat_mitzvah";
  if (pathname.includes("/events/henna-dj")) return "henna";
  if (pathname.includes("/events/chogeg-menagen")) return "chogeg_menagen";
  if (pathname.includes("/events/live-on-dj")) return "live_on_dj";
  return "events_general";
}

export function EventsLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const message = useMemo(() => {
    const key = getTemplateKeyFromPath(pathname);
    return getEventsWhatsAppMessage(key);
  }, [pathname]);

  return (
    <>
      {children}
      <EventsStickyCTA message={message} />
    </>
  );
}

export default EventsLayoutShell;
