import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;
/** לקוח עם service role. רץ רק בשרת. כל בדיקות ההרשאה נעשות בקוד לפני השימוש בו. */
export function adminDb(): SupabaseClient {
  // בדיקות אוטומטיות בלבד: מסד מדומה בזיכרון
  const t = (globalThis as { __reverTestDb?: SupabaseClient }).__reverTestDb;
  if (t && process.env.NODE_ENV === "test") return t;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase לא מוגדר בשרת");
  if (!admin) admin = createClient(url, key, { auth: { persistSession: false } });
  return admin;
}

/** חשבונות גוגל שמורשים להיכנס (בדרך כלל: החשבון של רבר). */
export const allowedGoogle = () =>
  (process.env.ALLOWED_GOOGLE_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

/** מוודא שהבקשה מגיעה ממכשיר שמחובר לחשבון גוגל מורשה. */
export async function verifyGoogle(req: Request): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) return null;
  const { data, error } = await adminDb().auth.getUser(token);
  const email = data.user?.email?.toLowerCase();
  if (error || !email) return null;
  return allowedGoogle().includes(email) ? email : null;
}
