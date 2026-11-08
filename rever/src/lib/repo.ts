import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { DB, Table } from "./types";
import { TABLES } from "./types";
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

const LS_KEY = "rever-crm-demo-v3";

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

class SupaRepo implements Repo {
  mode = "supabase" as const;
  constructor(private sb: SupabaseClient) {}
  async loadAll() {
    const out = {} as DB;
    await Promise.all(
      TABLES.map(async (t) => {
        const { data, error } = await this.sb.from(t).select("*");
        if (error) throw new Error(`${t}: ${error.message}`);
        (out as unknown as Record<string, unknown[]>)[t] = (data ?? []).map(stripNulls);
      }),
    );
    return out;
  }
  async upsert<T extends Table>(table: T, row: DB[T][number]) {
    const { error } = await this.sb.from(table).upsert(row as object);
    if (error) throw new Error(error.message);
  }
  async remove(table: Table, id: string) {
    const { error } = await this.sb.from(table).delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}

function stripNulls(r: Record<string, unknown>) {
  const o: Record<string, unknown> = {};
  for (const k in r) if (r[k] !== null && k !== "org_id" && k !== "updated_at") o[k] = r[k];
  return o;
}

export function makeRepo(): Repo {
  const sb = supabase();
  return sb ? new SupaRepo(sb) : new LocalRepo();
}
