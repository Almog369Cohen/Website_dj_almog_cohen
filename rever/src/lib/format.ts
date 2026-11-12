export const uid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));

export const nis = (n: number | undefined | null) =>
  "₪" + Math.round(n || 0).toLocaleString("he-IL");

const pad = (n: number) => String(n).padStart(2, "0");

export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayYmd = () => ymd(new Date());

/** local datetime string for <input type="datetime-local"> */
export const toLocalInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : undefined);

export const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
export const MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

export const shortDate = (s?: string) => {
  if (!s) return "—";
  const d = new Date(s.length === 10 ? s + "T00:00:00" : s);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}`;
};

export const time = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const sameDay = (a: Date, b: Date) => ymd(a) === ymd(b);

export const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

/** "היום 10:00" / "מחר" / "לפני יומיים" / "רביעי, 11.11" */
export const relDay = (iso?: string, withTime = true) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Math.round((startOfDay(d).getTime() - startOfDay().getTime()) / 86400000);
  const t = withTime && (d.getHours() || d.getMinutes()) ? " " + time(iso) : "";
  if (diff === 0) return "היום" + t;
  if (diff === 1) return "מחר" + t;
  if (diff === -1) return "אתמול" + t;
  if (diff === -2) return "לפני יומיים";
  if (diff < -2) return `לפני ${-diff} ימים`;
  return `${DAYS[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}` + t;
};

export const isOverdue = (iso?: string) => !!iso && new Date(iso) < startOfDay();
export const isDueToday = (iso?: string) => !!iso && new Date(iso) <= endOfDay();

export const initials = (name: string) =>
  name
    .replace(/משפחת\s*/, "")
    .split(/\s+|ו(?=[א-ת])/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

export const cleanPhone = (p: string) => {
  let d = (p || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "972" + d.slice(1);
  return d;
};

/** העתקה ללוח. עובד גם כשהדפדפן חוסם את navigator.clipboard (מחזיר false אם לא הצליח) */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
