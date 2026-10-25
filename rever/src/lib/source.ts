/** Where a visitor came from (UTM or referrer), kept for the session so a lead can carry it. */
const KEY = "rever-source";

const NAMES: [RegExp, string][] = [
  [/instagram/i, "אינסטגרם"],
  [/facebook|fb\.com|fbclid/i, "פייסבוק"],
  [/google/i, "גוגל"],
  [/whatsapp|wa\.me/i, "וואטסאפ"],
];

export function initSource() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(location.search);
    const raw = q.get("utm_source") || document.referrer || (q.get("fbclid") ? "facebook" : "");
    const host = raw.replace(/^https?:\/\//, "").split("/")[0];
    const named = NAMES.find(([re]) => re.test(raw))?.[1];
    sessionStorage.setItem(KEY, named || host || "ישיר");
  } catch {
    // storage can be blocked (private mode, in-app browsers): the source is simply unknown
  }
}

export function getSource(): string {
  try {
    return sessionStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}
