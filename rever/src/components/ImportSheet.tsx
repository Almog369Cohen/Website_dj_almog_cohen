"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Modal } from "./ui";
import type { Lead } from "@/lib/types";
import { buildLeads, fetchSheet, guessMapping, LEAD_FIELDS, parseCsv, type FieldId, type Mapping } from "@/lib/sheets";

/** שמירת הלידים החדשים + רישום בהיסטוריה */
export function useImportLeads() {
  const { save, log } = useStore();
  return async (leads: Lead[], source: string) => {
    for (const l of leads) {
      await save("leads", l);
      await log(l.id, "created", `ליד נכנס מ${source}`);
    }
  };
}

/** "משוך לידים חדשים" מהגיליון השמור, בלחיצה אחת */
export function usePullSheet() {
  const { db, save, toast, me } = useStore();
  const importLeads = useImportLeads();
  return async (quiet = false) => {
    const s = db.settings[0];
    if (!s?.sheet_url) return toast("עוד לא חובר גיליון. הגדרות ← ייבוא מגוגל שיטס");
    try {
      const rows = await fetchSheet(s.sheet_url);
      const map: Mapping = s.sheet_map ? JSON.parse(s.sheet_map) : guessMapping(rows[0] ?? []);
      const { fresh } = buildLeads(rows.slice(1), map, db.leads);
      await importLeads(fresh, "גוגל שיטס");
      if (me?.role === "admin") await save("settings", { ...s, sheet_last_pull: new Date().toISOString() });
      if (!quiet || fresh.length) toast(fresh.length ? `נוספו ${fresh.length} לידים חדשים מהגיליון ✓` : "אין לידים חדשים בגיליון");
      return fresh.length;
    } catch (e) {
      toast("משיכה מהגיליון נכשלה: " + (e instanceof Error ? e.message : e));
    }
  };
}

export default function ImportSheet({ onClose }: { onClose: () => void }) {
  const { db, save, toast, me } = useStore();
  const importLeads = useImportLeads();
  const saved = db.settings[0];
  const [url, setUrl] = useState(saved?.sheet_url ?? "");
  const [rows, setRows] = useState<string[][] | null>(null);
  const [map, setMap] = useState<Mapping>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [fromFile, setFromFile] = useState(false);
  const [remember, setRemember] = useState(true);
  const [auto, setAuto] = useState(saved?.sheet_auto ?? true);

  const load = (r: string[][], file: boolean) => {
    if (r.length < 2) throw new Error("הגיליון ריק או שיש בו רק כותרות");
    setRows(r);
    setMap(guessMapping(r[0]));
    setFromFile(file);
  };

  const preview = useMemo(() => (rows ? buildLeads(rows.slice(1), map, db.leads) : null), [rows, map, db.leads]);
  const headers = rows?.[0] ?? [];
  const missing = map.name === undefined || map.phone === undefined;

  return (
    <Modal title="ייבוא לידים מגוגל שיטס" onClose={onClose}>
      {!rows ? (
        <>
          <ol className="muted" style={{ fontSize: 14, lineHeight: 1.8, paddingRight: 18 }}>
            <li>בגוגל שיטס: <b>שיתוף ← "כל מי שיש לו את הקישור" ← צפייה</b></li>
            <li>מעתיקים את הקישור מהדפדפן ומדביקים כאן</li>
          </ol>
          <div className="f">
            <label>קישור לגיליון</label>
            <input dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/…" />
          </div>
          {err && <div className="banner err">{err}</div>}
          <div className="mfoot">
            <button
              className="btn pri"
              disabled={!url.trim() || busy}
              onClick={async () => {
                setBusy(true);
                setErr("");
                try {
                  load(await fetchSheet(url), false);
                } catch (e) {
                  setErr(e instanceof Error ? e.message : String(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "קורא…" : "קריאת הגיליון"}
            </button>
            <label className="btn" style={{ cursor: "pointer" }}>
              או העלאת קובץ CSV
              <input
                type="file"
                accept=".csv,text/csv"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    load(parseCsv(await f.text()), true);
                  } catch (x) {
                    setErr(x instanceof Error ? x.message : String(x));
                  }
                }}
              />
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="muted" style={{ fontSize: 14 }}>
            נמצאו {rows.length - 1} שורות. בדקו שכל עמודה מחוברת לשדה הנכון:
          </div>
          <div className="form">
            {LEAD_FIELDS.map((f) => (
              <div className="f" key={f.id}>
                <label>
                  {f.label}
                  {(f.id === "name" || f.id === "phone") && " *"}
                </label>
                <select
                  value={map[f.id] ?? ""}
                  onChange={(e) => setMap({ ...map, [f.id as FieldId]: e.target.value === "" ? undefined : Number(e.target.value) })}
                >
                  <option value="">— לא לייבא</option>
                  {headers.map((h, i) => (
                    <option key={i} value={i}>
                      {h || `עמודה ${i + 1}`} {rows[1]?.[i] ? `(${rows[1][i].slice(0, 18)})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {preview && (
            <div className="banner" style={{ background: preview.fresh.length ? "var(--greenbg)" : undefined, color: preview.fresh.length ? "var(--green)" : undefined, borderColor: "transparent" }}>
              <b>{preview.fresh.length} לידים חדשים ייכנסו</b>
              {preview.duplicates > 0 && ` · ${preview.duplicates} כבר קיימים במערכת (לפי טלפון) ולא ייכנסו שוב`}
              {preview.invalid > 0 && ` · ${preview.invalid} שורות בלי שם או טלפון`}
            </div>
          )}
          {preview && preview.fresh.length > 0 && (
            <div className="tablewrap" style={{ maxHeight: 180, border: "1px solid var(--line)", borderRadius: 10 }}>
              <table className="tbl" style={{ fontSize: 13.5 }}>
                <tbody>
                  {preview.fresh.slice(0, 5).map((l) => (
                    <tr key={l.id}>
                      <td><b>{l.name}</b></td>
                      <td dir="ltr" style={{ textAlign: "right" }}>{l.phone}</td>
                      <td>{l.event_type}</td>
                      <td>{l.event_date ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!fromFile && me?.role === "admin" && (
            <>
              <label className="radio">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                לזכור את הגיליון, כדי למשוך לידים חדשים בלחיצה אחת
              </label>
              {remember && (
                <label className="radio">
                  <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
                  למשוך לידים חדשים אוטומטית בכל כניסה למערכת
                </label>
              )}
            </>
          )}
          <div className="mfoot">
            <button
              className="btn pri"
              disabled={missing || busy || !preview}
              onClick={async () => {
                if (!preview) return;
                setBusy(true);
                await importLeads(preview.fresh, fromFile ? "קובץ" : "גוגל שיטס");
                if (!fromFile && remember && me?.role === "admin" && saved)
                  await save("settings", { ...saved, sheet_url: url.trim(), sheet_map: JSON.stringify(map), sheet_auto: auto, sheet_last_pull: new Date().toISOString() });
                toast(`יובאו ${preview.fresh.length} לידים ✓`);
                onClose();
              }}
            >
              ייבוא {preview?.fresh.length ?? 0} לידים
            </button>
            <button className="btn" onClick={() => setRows(null)}>
              חזרה
            </button>
          </div>
          {missing && <div className="banner err">חובה לבחור עמודה לשם ולטלפון</div>}
        </>
      )}
    </Modal>
  );
}
