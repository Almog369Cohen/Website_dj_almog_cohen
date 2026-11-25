/**
 * שמירה בלי דריסה: המסך שולח את השורה החדשה + השורה כפי שהייתה כשנטענה ("בסיס").
 * נכתבים רק השדות שהשתנו מול הבסיס. שני עובדים שמשנים שדות שונים באותו זמן: שני השינויים נשמרים.
 * אותו שדה: האחרון קובע. אותה לוגיקה ב-apps-script/Code.gs (changedKeys_).
 */
const norm = (v: unknown) => (v === undefined || v === null || v === "" ? null : typeof v === "object" ? JSON.stringify(v) : String(v));
export const sameValue = (a: unknown, b: unknown) => norm(a) === norm(b);
export function changedKeys(row: Record<string, unknown>, base: Record<string, unknown>) {
  return Object.keys(row).filter((k) => k !== "id" && !sameValue(row[k], base[k]));
}
