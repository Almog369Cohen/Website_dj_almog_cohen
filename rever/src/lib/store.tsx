"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Activity, ActivityKind, DB, Lead, LeadStatus, Member, Perm, Settings, Table } from "./types";
import { useAuth } from "./auth";
import { statusLabel } from "./types";
import { makeRepo, type Repo } from "./repo";
import { emptyDB } from "./seed";
import { uid } from "./format";

interface Store {
  db: DB;
  ready: boolean;
  error: string | null;
  mode: Repo["mode"];
  settings: Settings;
  /** המשתמש המחובר (undefined = אין לו גישה) */
  me?: Member;
  can(perm: Perm): boolean;
  reload(): Promise<void>;
  save<T extends Table>(table: T, row: DB[T][number]): Promise<void>;
  remove(table: Table, id: string): Promise<void>;
  log(lead_id: string, kind: ActivityKind, text: string): Promise<void>;
  setStatus(lead: Lead, status: LeadStatus): Promise<void>;
  updateLead(lead: Lead, patch: Partial<Lead>): Promise<void>;
  lead(id?: string): Lead | undefined;
  resetDemo?: () => Promise<void>;
  toast(msg: string): void;
  toastMsg: string | null;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { email } = useAuth();
  const repoRef = useRef<Repo | null>(null);
  const [db, setDb] = useState<DB>(emptyDB());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const toast = useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const load = useCallback(async () => {
    const repo = repoRef.current!;
    try {
      const data = await repo.loadAll();
      if (!data.settings?.length) data.settings = emptyDB().settings;
      if (!data.templates?.length) data.templates = emptyDB().templates;
      setDb(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    repoRef.current = makeRepo();
    load();
  }, [load]);

  const save = useCallback(
    async <T extends Table>(table: T, row: DB[T][number]) => {
      setDb((prev) => {
        const list = [...(prev[table] as { id: string }[])];
        const i = list.findIndex((r) => r.id === (row as { id: string }).id);
        if (i >= 0) list[i] = row as { id: string };
        else list.push(row as { id: string });
        return { ...prev, [table]: list };
      });
      try {
        await repoRef.current!.upsert(table, row);
      } catch (e) {
        toast("השמירה נכשלה: " + (e instanceof Error ? e.message : e));
        load();
      }
    },
    [load, toast],
  );

  const remove = useCallback(
    async (table: Table, id: string) => {
      setDb((prev) => ({ ...prev, [table]: (prev[table] as { id: string }[]).filter((r) => r.id !== id) }));
      try {
        await repoRef.current!.remove(table, id);
      } catch (e) {
        toast("המחיקה נכשלה: " + (e instanceof Error ? e.message : e));
        load();
      }
    },
    [load, toast],
  );

  const log = useCallback(
    (lead_id: string, kind: ActivityKind, text: string) =>
      save("activities", { id: uid(), lead_id, kind, text, at: new Date().toISOString() } as Activity),
    [save],
  );

  const updateLead = useCallback((lead: Lead, patch: Partial<Lead>) => save("leads", { ...lead, ...patch }), [save]);

  const setStatus = useCallback(
    async (lead: Lead, status: LeadStatus) => {
      if (lead.status === status) return;
      await updateLead(lead, { status });
      await log(lead.id, "status", `סטטוס שונה ל"${statusLabel(status)}"`);
    },
    [updateLead, log],
  );

  const me = db.members.find((m) => m.id === email && m.active);
  const can = useCallback(
    (perm: Perm) => {
      if (!me) return false;
      if (me.role === "admin") return true;
      if (perm === "finance") return me.can_finance;
      if (perm === "delete") return me.can_delete;
      if (perm === "templates") return me.can_templates;
      return false; // settings: מנהלים בלבד
    },
    [me],
  );

  const value = useMemo<Store>(
    () => ({
      me,
      can,
      reload: load,
      db,
      ready,
      error,
      mode: repoRef.current?.mode ?? "demo",
      // בהודעות: השם של מי ששולח
      settings: { ...(db.settings[0] ?? emptyDB().settings[0]), owner_name: me?.name || db.settings[0]?.owner_name || "" },
      save,
      remove,
      log,
      setStatus,
      updateLead,
      lead: (id?: string) => db.leads.find((l) => l.id === id),
      resetDemo: repoRef.current?.reset
        ? async () => {
            const d = await repoRef.current!.reset!();
            setDb(d);
            toast("נתוני הדמו אופסו");
          }
        : undefined,
      toast,
      toastMsg,
    }),
    [db, ready, error, save, remove, log, setStatus, updateLead, toast, toastMsg, me, can, load],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
};
