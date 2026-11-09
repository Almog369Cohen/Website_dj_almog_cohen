import type { Lead } from "./types";
import { EVENT_TYPES } from "./types";
import { cleanPhone, uid } from "./format";

/** שדות שאפשר למפות מעמודות בגיליון */
export const LEAD_FIELDS = [
  { id: "name", label: "שם", keys: ["שם", "שם מלא", "name", "full name", "full_name", "לקוח", "שם הלקוח", "זוג"] },
  { id: "phone", label: "טלפון", keys: ["טלפון", "נייד", "פלאפון", "phone", "phone number", "phone_number", "mobile", "מספר טלפון"] },
  { id: "email", label: "אימייל", keys: ["אימייל", "מייל", "email", "e-mail", "דואל"] },
  { id: "event_type", label: "סוג אירוע", keys: ["סוג אירוע", "סוג האירוע", "אירוע", "event", "event type", "event_type"] },
  { id: "event_date", label: "תאריך אירוע", keys: ["תאריך", "תאריך אירוע", "תאריך האירוע", "date", "event date", "event_date"] },
  { id: "guests", label: "מוזמנים", keys: ["מוזמנים", "כמות מוזמנים", "מספר מוזמנים", "אורחים", "guests"] },
  { id: "venue", label: "מקום", keys: ["מקום", "אולם", "מיקום", "venue", "location"] },
  { id: "source", label: "מקור", keys: ["מקור", "הגיעו דרך", "מאיפה", "source", "platform", "campaign", "קמפיין"] },
  { id: "notes", label: "הערות", keys: ["הערות", "הערה", "notes", "note", "comments", "פרטים"] },
  { id: "created_at", label: "תאריך פנייה", keys: ["תאריך פנייה", "נוצר", "created", "created_time", "created_at", "timestamp", "חותמת זמן"] },
] as const;
export type FieldId = (typeof LEAD_FIELDS)[number]["id"];
export type Mapping = Partial<Record<FieldId, number>>; // שדה → מספר עמודה

/** קישור רגיל לגיליון → קישור להורדת CSV של אותה לשונית */
export function toCsvUrl(url: string): string | null {
  const u = url.trim();
  if (/\/pub\?.*output=csv/.test(u) || /export\?format=csv/.test(u)) return u;
  const m = u.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (!m) return null;
  const gid = u.match(/[#&?]gid=(\d+)/)?.[1] ?? "0";
  return `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv&gid=${gid}`;
}

/** פענוח CSV (כולל מרכאות, פסיקים ושורות בתוך תא) */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  const t = text.replace(/^﻿/, "");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"' && t[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") row.push(cell), (cell = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) row.push(cell), rows.push(row);
  return rows.filter((r) => r.some((x) => x.trim()));
}

const norm = (s: string) => s.trim().toLowerCase().replace(/[_\-:]/g, " ").replace(/\s+/g, " ");

/** זיהוי אוטומטי של העמודות לפי הכותרות */
export function guessMapping(headers: string[]): Mapping {
  const map: Mapping = {};
  const used = new Set<number>();
  for (const f of LEAD_FIELDS) {
    const keys = f.keys.map(norm);
    let idx = headers.findIndex((h, i) => !used.has(i) && keys.includes(norm(h)));
    if (idx < 0) idx = headers.findIndex((h, i) => !used.has(i) && keys.some((k) => norm(h).includes(k)));
    if (idx >= 0) {
      map[f.id] = idx;
      used.add(idx);
    }
  }
  return map;
}

/** תאריך מהגיליון (31/12/2026, 31.12.26, 2026-12-31) → YYYY-MM-DD */
export function parseDate(s?: string): string | undefined {
  if (!s) return undefined;
  const v = s.trim();
  let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = v.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? "20" + m[3] : m[3];
    return `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }
  return undefined;
}

const phoneKey = (p?: string) => cleanPhone(p ?? "").slice(-9);

export interface ImportPreview {
  fresh: Lead[]; // חדשים שייכנסו
  duplicates: number; // כבר קיימים (לפי טלפון)
  invalid: number; // בלי שם או טלפון
}

/** הופך שורות מהגיליון ללידים, בלי כפילויות מול מה שכבר במערכת */
export function buildLeads(rows: string[][], map: Mapping, existing: Lead[], source = "גוגל שיטס"): ImportPreview {
  const seen = new Set(existing.map((l) => phoneKey(l.phone)).filter(Boolean));
  const get = (r: string[], f: FieldId) => (map[f] === undefined ? undefined : (r[map[f]!] ?? "").trim() || undefined);
  const now = new Date().toISOString();
  const fresh: Lead[] = [];
  let duplicates = 0;
  let invalid = 0;
  for (const r of rows) {
    const name = get(r, "name");
    const phone = get(r, "phone");
    if (!name || !phone || phoneKey(phone).length < 7) {
      invalid++;
      continue;
    }
    const key = phoneKey(phone);
    if (seen.has(key)) {
      duplicates++;
      continue;
    }
    seen.add(key);
    const et = get(r, "event_type");
    const guests = Number((get(r, "guests") ?? "").replace(/\D/g, ""));
    const created = parseDate(get(r, "created_at"));
    fresh.push({
      id: uid(),
      name,
      phone,
      email: get(r, "email"),
      event_type: et ? EVENT_TYPES.find((t) => et.includes(t)) ?? et : "אחר",
      event_date: parseDate(get(r, "event_date")),
      guests: guests > 0 ? guests : undefined,
      venue: get(r, "venue"),
      source: get(r, "source") ?? source,
      notes: get(r, "notes"),
      status: "new",
      next_followup: now,
      followup_note: "ליד מהגיליון: לשלוח הודעת היכרות",
      created_at: created ? new Date(created + "T12:00:00").toISOString() : now,
    });
  }
  return { fresh, duplicates, invalid };
}

/** מושך CSV מגוגל שיטס. הגיליון צריך להיות משותף ל"כל מי שיש לו את הקישור". */
export async function fetchSheet(url: string): Promise<string[][]> {
  const csv = toCsvUrl(url);
  if (!csv) throw new Error("זה לא נראה כמו קישור לגוגל שיטס");
  let text: string | null = null;
  try {
    const r = await fetch(csv);
    if (r.ok) text = await r.text();
  } catch {}
  if (text === null || /^\s*<!DOCTYPE html/i.test(text)) {
    // גיבוי: דרך השרת של המערכת (אם הדפדפן חוסם)
    const r = await fetch(`/api/sheet?url=${encodeURIComponent(csv)}`);
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "לא הצלחתי לקרוא את הגיליון");
    text = await r.text();
  }
  if (/^\s*<!DOCTYPE html/i.test(text)) throw new Error('הגיליון לא משותף. בגוגל שיטס: שיתוף ← "כל מי שיש לו את הקישור" ← צפייה');
  return parseCsv(text);
}
