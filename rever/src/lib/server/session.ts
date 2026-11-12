import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/** סשן עובד: עוגייה חתומה (httpOnly) עם מזהה העובד. נוצרת רק אחרי חשבון גוגל מורשה + קוד אישי נכון. */
export const COOKIE = "rever_staff";
const TTL_H = 12;

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET חסר או קצר מ-32 תווים");
  return s;
};

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function makeSession(staffId: string) {
  const payload = b64(JSON.stringify({ sid: staffId, exp: Date.now() + TTL_H * 3600_000 }));
  return `${payload}.${sign(payload)}`;
}

export function readSession(): string | null {
  return verifySession(cookies().get(COOKIE)?.value);
}

export function verifySession(v?: string): string | null {
  if (!v) return null;
  const [payload, mac] = v.split(".");
  if (!payload || !mac) return null;
  const want = Buffer.from(sign(payload));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const { sid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof sid === "string" && exp > Date.now() ? sid : null;
  } catch {
    return null;
  }
}

/* ───── כניסת הזוג: אסימון חתום (נשמר בטלפון שלהם), נפרד לגמרי מסשן עובד ───── */
const CLIENT_DAYS = 90;
const csign = (data: string) => sign("client:" + data);

export function makeClientSession(planId: string, ver: number) {
  const payload = b64(JSON.stringify({ pid: planId, v: ver, exp: Date.now() + CLIENT_DAYS * 86400_000 }));
  return `${payload}.${csign(payload)}`;
}

export function verifyClientSession(v?: unknown): { pid: string; v: number } | null {
  if (typeof v !== "string") return null;
  const [payload, mac] = v.split(".");
  if (!payload || !mac) return null;
  const want = Buffer.from(csign(payload));
  const got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const o = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof o.pid === "string" && o.exp > Date.now() ? { pid: o.pid, v: Number(o.v) || 0 } : null;
  } catch {
    return null;
  }
}

export const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: TTL_H * 3600,
};

export function hashPin(pin: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pin, salt, 32).toString("hex")}`;
}

export function checkPin(pin: string, stored?: string | null) {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  const got = scryptSync(pin, salt, 32);
  const want = Buffer.from(hash, "hex");
  return got.length === want.length && timingSafeEqual(got, want);
}

export const validPin = (pin: unknown): pin is string => typeof pin === "string" && /^\d{4,8}$/.test(pin);
