import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DB, Table } from "./types";
import { demoDB } from "./seed";

/** שכבת נתונים אחת עם שני מימושים: Supabase (אמיתי) או localStorage (דמו). */
export interface Repo {
  mode: "supabase" | "demo";
  loadAll(): Promise<DB>;
  upsert<T extends Table>(table: T, row: DB[T][number]): Promise<void>;
  remove(table: Table, id: string): Promise<void>;
  reset?(): Promise<DB>;
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
export const supabase = () => {
  if (!URL || !KEY) return null;
  if (!client) client = createClient(URL, KEY);
  return client;
};

const LS_KEY = "rever-crm-demo-v5";

/** עובדים במצב דמו (כולל קודים), למסך בחירת העובד */
export function demoMembers() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return (JSON.parse(raw) as DB).members ?? [];
  } catch {}
  return demoDB().members;
}

class LocalRepo implements Repo {
  mode = "demo" as const;
  private read(): DB {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw) as DB;
    } catch {}
    const db = demoDB();
    this.write(db);
    return db;
  }
  private write(db: DB) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(db));
    } catch {}
  }
  async loadAll() {
    return this.read();
  }
  async upsert<T extends Table>(table: T, row: DB[T][number]) {
    const db = this.read();
    const list = db[table] as { id: string }[];
    const i = list.findIndex((r) => r.id === (row as { id: string }).id);
    if (i >= 0) list[i] = row as { id: string };
    else list.push(row as { id: string });
    this.write(db);
  }
  async remove(table: Table, id: string) {
    const db = this.read();
    (db[table] as { id: string }[]) = (db[table] as { id: string }[]).filter((r) => r.id !== id);
    this.write(db);
  }
  async reset() {
    const db = demoDB();
    this.write(db);
    return db;
  }
}

/** מצב אמיתי: כל הנתונים עוברים דרך השרת של המערכת, שבודק את הרשאות העובד. */
class ApiRepo implements Repo {
  mode = "supabase" as const;
  private async call(method: string, url: string, body?: unknown) {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) window.dispatchEvent(new Event("rever:signed-out"));
    if (!res.ok) throw new Error(data.error || `שגיאה ${res.status}`);
    return data;
  }
  async loadAll() {
    return (await this.call("GET", "/api/data")) as DB;
  }
  async upsert<T extends Table>(table: T, row: DB[T][number]) {
    await this.call("POST", "/api/data", { table, row });
  }
  async remove(table: Table, id: string) {
    await this.call("DELETE", `/api/data?table=${table}&id=${encodeURIComponent(id)}`);
  }
}

export function makeRepo(): Repo {
  return supabase() ? new ApiRepo() : new LocalRepo();
}
