"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Activity, ActivityKind, DB, EventPlan, Lead, LeadStatus, Member, Perm, Settings, Table } from "./types";
import { useAuth } from "./auth";
import { memberCan, statusLabel, TABLES } from "./types";
import { makeRepo, type Repo } from "./repo";
import { emptyDB } from "./seed";
import { uid } from "./format";
import type { ClientTask } from "./tasks";

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
  /** המשימות של הזוג: נשמרות במסלול נפרד עם גרסה */
  saveTasks(planId: string, tasks: ClientTask[], dismissed: string[]): Promise<void>;
  log(lead_id: string, kind: ActivityKind, text: string): Promise<void>;
  setStatus(lead: Lead, status: LeadStatus): Promise<void>;
  updateLead(lead: Lead, patch: Partial<Lead>): Promise<void>;
  lead(id?: string): Lead | undefined;
  resetDemo?: () => Promise<void>;
  setPin?: (staffId: string, pin: string) => Promise<void>;
  cleanDemo?: () => Promise<void>;
  restoreDemo?: (db: DB) => Promise<void>;
  toast(msg: string): void;
  toastMsg: string | null;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { staffId } = useAuth();
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

  // כמה שמירות באוויר, ומונה שמתקדם בכל שמירה: רענון ברקע לא דורס שמירה שעוד לא הסתיימה
  const pending = useRef(0);
  const writeSeq = useRef(0);
  const load = useCallback(async (background = false) => {
    const repo = repoRef.current!;
    if (background && pending.current) return;
    const seq = writeSeq.current;
    try {
      const data = await repo.loadAll();
      if (background && (pending.current || seq !== writeSeq.current)) return; // נכתב משהו בזמן הטעינה: נרענן בפעם הבאה
      for (const t of TABLES) if (!Array.isArray(data[t])) (data as unknown as Record<string, unknown[]>)[t] = [];
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

  // גוגל שיטס / Supabase: רענון אוטומטי כדי לראות שינויים של שאר הצוות (כל דקה + כשחוזרים לחלון)
  useEffect(() => {
    if (!repoRef.current || repoRef.current.mode === "demo") return;
    const tick = () => document.visibilityState === "visible" && load(true);
    const id = setInterval(tick, 60_000);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", tick);
    };
  }, [load, ready]);

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
        pending.current++;
        writeSeq.current++;
        await repoRef.current!.upsert(table, row).finally(() => pending.current--);
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

  // שמירות משימות יוצאות אחת-אחת. הגרסה נלקחת רק ממה שהשרת אישר (לא מניחוש מקומי),
  // ואחרי כישלון כל השמירות שחיכו בתור נזרקות וטוענים מחדש, כדי לא לדרוס שינוי של הזוג.
  const tasksQueue = useRef(Promise.resolve());
  const tasksGen = useRef(0);
  const dbRef = useRef(db);
  dbRef.current = db;
  const saveTasks = useCallback(
    (planId: string, tasks: ClientTask[], dismissed: string[]) => {
      const gen = tasksGen.current;
      const patchLocal = (p: Partial<EventPlan>) => {
        const cur = dbRef.current.event_plans.find((x) => x.id === planId) ?? { id: planId };
        const next = { ...cur, ...p };
        dbRef.current = { ...dbRef.current, event_plans: [...dbRef.current.event_plans.filter((x) => x.id !== planId), next] };
        setDb((prev) => ({ ...prev, event_plans: [...prev.event_plans.filter((x) => x.id !== planId), { ...(prev.event_plans.find((x) => x.id === planId) ?? { id: planId }), ...p }] }));
      };
      patchLocal({ client_tasks: JSON.stringify(tasks), dismissed_suggestions: JSON.stringify(dismissed) }); // המסך מתעדכן מיד
      const run = async () => {
        if (gen !== tasksGen.current) return; // שמירה ישנה מלפני כישלון
        const rev = Number(dbRef.current.event_plans.find((x) => x.id === planId)?.client_tasks_rev) || 0;
        pending.current++;
        writeSeq.current++;
        try {
          const r = await repoRef.current!.saveTasks(planId, { tasks, dismissed, rev }).finally(() => pending.current--);
          patchLocal({ client_tasks_rev: r.rev });
        } catch (e) {
          tasksGen.current++;
          toast("המשימות לא נשמרו: " + (e instanceof Error ? e.message : e));
          await load();
        }
      };
      return (tasksQueue.current = tasksQueue.current.then(run, run));
    },
    [load, toast],
  );

  const me = db.members.find((m) => m.id === staffId && m.active);
  const can = useCallback((perm: Perm) => memberCan(me, perm), [me]);

  const log = useCallback(
    (lead_id: string, kind: ActivityKind, text: string) =>
      save("activities", { id: uid(), lead_id, kind, text, at: new Date().toISOString(), by: me?.id } as Activity),
    [save, me?.id],
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

  const value = useMemo<Store>(
    () => ({
      me,
      can,
      reload: () => load(),
      db,
      ready,
      error,
      mode: repoRef.current?.mode ?? "demo",
      // בהודעות: השם של מי ששולח
      settings: { ...(db.settings[0] ?? emptyDB().settings[0]), owner_name: me?.name || db.settings[0]?.owner_name || "" },
      save,
      remove,
      saveTasks,
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
      setPin: repoRef.current?.setPin ? (id: string, pin: string) => repoRef.current!.setPin!(id, pin) : undefined,
      cleanDemo: repoRef.current?.clean
        ? async () => {
            setDb(await repoRef.current!.clean!());
            toast("נתוני הדוגמה נמחקו. אפשר להתחיל לעבוד ✓");
          }
        : undefined,
      restoreDemo: repoRef.current?.restore
        ? async (d: DB) => {
            setDb(await repoRef.current!.restore!(d));
            toast("הגיבוי שוחזר ✓");
          }
        : undefined,
      toast,
      toastMsg,
    }),
    [db, ready, error, save, remove, saveTasks, log, setStatus, updateLead, toast, toastMsg, me, can, load],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
};
