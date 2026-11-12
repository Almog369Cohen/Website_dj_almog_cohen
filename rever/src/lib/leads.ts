import type { DB, Lead } from "./types";

/**
 * לידים שנופלים בין הכיסאות: ליד פתוח שאין לו פולואפ קבוע.
 * (ליד עם פולואפ, גם באיחור, כבר מופיע ב"פולואפים להיום", אז לא מכפילים.)
 */
export type StuckReason = "new_untouched" | "quote_silent" | "no_followup";

const DAY = 86400000;
const daysSince = (iso: string | undefined, now: number) => (iso ? Math.floor((now - +new Date(iso)) / DAY) : Infinity);

export function stuckLeads(db: Pick<DB, "leads" | "docs">, now = Date.now()) {
  const out: { lead: Lead; reason: StuckReason; text: string }[] = [];
  for (const l of db.leads) {
    if (["won", "lost"].includes(l.status) || l.next_followup) continue;
    const touched = daysSince(l.last_contact, now);
    if (l.status === "new" && touched === Infinity && now - +new Date(l.created_at) >= DAY) {
      out.push({ lead: l, reason: "new_untouched", text: `ליד חדש שלא טופל ${Math.max(1, daysSince(l.created_at, now))} ימים` });
      continue;
    }
    if (l.status === "quote") {
      const sent = db.docs.filter((d) => d.lead_id === l.id && d.type === "quote" && d.status === "sent").map((d) => d.date).sort().pop();
      const quiet = Math.min(touched, daysSince(sent, now));
      if (quiet >= 3 && quiet !== Infinity) {
        out.push({ lead: l, reason: "quote_silent", text: `הצעת מחיר בלי תגובה ${quiet} ימים` });
        continue;
      }
    }
    out.push({ lead: l, reason: "no_followup", text: "אין פולואפ קבוע" });
  }
  const rank: Record<StuckReason, number> = { new_untouched: 0, quote_silent: 1, no_followup: 2 };
  return out.sort((a, b) => rank[a.reason] - rank[b.reason] || +new Date(a.lead.created_at) - +new Date(b.lead.created_at));
}

/** ערך הצנרת: כמה כסף יושב בהצעות מחיר פתוחות, וכמה מהן לאירועים בחודשיים הקרובים */
export function pipeline(leads: Lead[], now = new Date()) {
  const open = leads.filter((l) => l.status === "quote" && (l.price ?? 0) > 0);
  const soon = new Date(now);
  soon.setMonth(soon.getMonth() + 2);
  const near = open.filter((l) => l.event_date && new Date(l.event_date) <= soon);
  const sum = (ls: Lead[]) => ls.reduce((s, l) => s + (l.price ?? 0), 0);
  return { count: open.length, total: sum(open), nearCount: near.length, near: sum(near) };
}
