import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** מושך CSV של גיליון גוגל משותף. מותר רק לכתובות של Google Sheets (לא פרוקסי פתוח). */
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url") ?? "";
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return NextResponse.json({ error: "כתובת לא תקינה" }, { status: 400 });
  }
  if (u.protocol !== "https:" || u.hostname !== "docs.google.com" || !u.pathname.startsWith("/spreadsheets/")) {
    return NextResponse.json({ error: "מותר רק קישור של Google Sheets" }, { status: 400 });
  }
  try {
    const r = await fetch(u.toString(), { redirect: "follow", cache: "no-store" });
    const text = await r.text();
    if (!r.ok || /^\s*<!DOCTYPE html/i.test(text)) {
      return NextResponse.json({ error: 'הגיליון לא משותף. בגוגל שיטס: שיתוף ← "כל מי שיש לו את הקישור" ← צפייה' }, { status: 403 });
    }
    return new NextResponse(text.slice(0, 5_000_000), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
  } catch {
    return NextResponse.json({ error: "לא הצלחתי להגיע לגיליון" }, { status: 502 });
  }
}
