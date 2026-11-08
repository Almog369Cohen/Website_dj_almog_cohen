import type { CalendarKind, DB } from "./types";

export interface AgendaItem {
  key: string;
  kind: CalendarKind;
  title: string;
  sub: string;
  start: string;
  allDay: boolean;
  lead_id?: string;
  item_id?: string; // אם הגיע מטבלת calendar_items (ניתן לעריכה)
}

/** כל מה שמופיע ביומן: פריטים ידניים + אירועים של לקוחות סגורים + פולואפים של לידים פתוחים */
export function agendaItems(db: DB): AgendaItem[] {
  const out: AgendaItem[] = [];
  for (const c of db.calendar_items) {
    const l = db.leads.find((x) => x.id === c.lead_id);
    out.push({
      key: "c" + c.id,
      kind: c.kind,
      title: c.title,
      sub: [c.kind === "meeting" ? "פגישה" : c.kind === "event" ? "אירוע" : "תזכורת", c.location, l?.event_type].filter(Boolean).join(" · "),
      start: c.start,
      allDay: false,
      lead_id: c.lead_id,
      item_id: c.id,
    });
  }
  for (const l of db.leads) {
    if (l.status === "won" && l.event_date) {
      out.push({
        key: "e" + l.id,
        kind: "event",
        title: `${l.event_type}: ${l.name}`,
        sub: [l.venue, l.guests ? `${l.guests} איש` : ""].filter(Boolean).join(" · ") || "אירוע",
        start: new Date(l.event_date + "T20:00:00").toISOString(),
        allDay: true,
        lead_id: l.id,
      });
    }
    if (!["won", "lost"].includes(l.status) && l.next_followup) {
      // לא להכפיל אם כבר יש פגישה לאותו ליד באותה שעה
      const dup = db.calendar_items.some((c) => c.lead_id === l.id && c.start === l.next_followup);
      if (!dup)
        out.push({
          key: "f" + l.id,
          kind: "followup",
          title: `פולואפ: ${l.name}`,
          sub: l.followup_note || "לחזור ללקוח",
          start: l.next_followup,
          allDay: false,
          lead_id: l.id,
        });
    }
  }
  return out.sort((a, b) => +new Date(a.start) - +new Date(b.start));
}
