import { NextResponse } from "next/server";
import { currentMember, deleteRow, Forbidden, isTable, readAll, writeRow } from "@/lib/server/access";

export const dynamic = "force-dynamic";

const fail = (e: unknown) =>
  NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: e instanceof Forbidden ? 403 : 500 });

export async function GET() {
  try {
    const me = await currentMember();
    if (!me) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    return NextResponse.json(await readAll(me));
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const me = await currentMember();
    if (!me) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    const { table, row } = await req.json();
    if (!isTable(table)) return NextResponse.json({ error: "טבלה לא קיימת" }, { status: 400 });
    await writeRow(me, table, row);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request) {
  try {
    const me = await currentMember();
    if (!me) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
    const u = new URL(req.url);
    const table = u.searchParams.get("table");
    const id = u.searchParams.get("id");
    if (!isTable(table) || !id) return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
    await deleteRow(me, table, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
