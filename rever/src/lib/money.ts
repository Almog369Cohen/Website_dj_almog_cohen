import type { Lead, MoneyItem, MoneyPay } from "./types";

/**
 * כספים מכרטיס הלקוח: הסכומים שרבר מציגים + תוכנית תשלומים עם רישום מה שולם.
 * בלי הנהלת חשבונות, בלי תנועות, בלי הוצאות של העסק. מסך "כספים" מחושב מכאן.
 */
const parse = <X>(s: string | undefined, d: X): X => {
  try {
    const v = s ? JSON.parse(s) : d;
    return Array.isArray(d) && !Array.isArray(v) ? d : v;
  } catch {
    return d;
  }
};
export const moneyItems = (l: Pick<Lead, "money_items">) => parse<MoneyItem[]>(l.money_items, []);
export const moneyPlan = (l: Pick<Lead, "money_plan">) => parse<MoneyPay[]>(l.money_plan, []);

const today = () => new Date().toISOString().slice(0, 10);
const dayDiff = (ymd: string, now = today()) => Math.round((+new Date(ymd + "T12:00:00") - +new Date(now + "T12:00:00")) / 86400000);

/** סה"כ (מהשורות, ואם אין שורות: מחיר הליד), שולם ונותר */
export function moneyOf(l: Lead, now = today()) {
  const items = moneyItems(l);
  const plan = moneyPlan(l);
  const total = items.length ? items.reduce((s, i) => s + (Number(i.price) || 0), 0) : Number(l.price) || 0;
  const paid = plan.reduce((s, p) => s + (p.paid ? Number(p.paid.amount) || 0 : 0), 0);
  const open = plan.filter((p) => !p.paid);
  const late = open.filter((p) => p.due && dayDiff(p.due, now) < 0);
  return { items, plan, total, paid, remaining: Math.max(0, total - paid), late: late.length, planned: plan.reduce((s, p) => s + (Number(p.amount) || 0), 0) };
}

/** תשלומים שלא שולמו ומועדם עבר או בתוך X ימים */
export function duePays(leads: Lead[], withinDays = 14, now = today()) {
  const out: { lead: Lead; pay: MoneyPay; days: number; late: boolean }[] = [];
  for (const l of leads) {
    if (l.status === "lost") continue;
    for (const p of moneyPlan(l)) {
      if (p.paid || !p.due) continue;
      const days = dayDiff(p.due, now);
      if (days <= withinDays) out.push({ lead: l, pay: p, days, late: days < 0 });
    }
  }
  return out.sort((a, b) => a.days - b.days);
}

/** סיכום לפי חודש האירוע: כמה כסף באירועים של החודש, כמה שולם */
export function byMonth(leads: Lead[]) {
  const m = new Map<string, { month: string; events: number; total: number; paid: number }>();
  for (const l of leads) {
    if (l.status !== "won" || !l.event_date) continue;
    const key = l.event_date.slice(0, 7);
    const r = m.get(key) ?? { month: key, events: 0, total: 0, paid: 0 };
    const x = moneyOf(l);
    r.events++;
    r.total += x.total;
    r.paid += x.paid;
    m.set(key, r);
  }
  return [...m.values()].sort((a, b) => a.month.localeCompare(b.month));
}

/** שומר רישומי "שולם" קיימים כשמי שאין לו הרשאת כספים עורך את התוכנית */
export function keepPaid(next: unknown, prev: unknown): string | null {
  if (typeof next !== "string") return typeof prev === "string" ? prev : null;
  try {
    const old = new Map((parse<MoneyPay[]>(typeof prev === "string" ? prev : undefined, [])).map((p) => [p.id, p.paid]));
    return JSON.stringify(parse<MoneyPay[]>(next, []).map((p) => {
      const was = old.get(p.id);
      const { paid: _p, ...rest } = p;
      return was ? { ...rest, paid: was } : rest;
    }));
  } catch {
    return typeof prev === "string" ? prev : null;
  }
}
