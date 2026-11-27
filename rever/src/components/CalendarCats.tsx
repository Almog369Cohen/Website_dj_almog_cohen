"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { BUILTIN_CATS, CAL_COLORS, MAX_CATS, calendarCats, sanitizeCats, type CalendarCat } from "@/lib/agenda";
import { uid } from "@/lib/format";
import { Modal } from "./ui";

const COLOR_NAMES: Record<string, string> = { green: "ירוק", violet: "סגול", orange: "כתום", blue: "כחול", red: "אדום", gold: "זהב", teal: "טורקיז", pink: "ורוד", gray: "אפור" };

/** קטגוריות צבע ביומן: נשמרות בהגדרות העסק (מאסטר בלבד). שלוש הקבועות אפשר לשנות, לא למחוק. */
export function CategoriesModal({ onClose }: { onClose(): void }) {
  const { settings, save, toast } = useStore();
  const [list, setList] = useState<CalendarCat[]>(() => calendarCats(settings));
  const set = (i: number, p: Partial<CalendarCat>) => setList((l) => l.map((c, j) => (j === i ? { ...c, ...p } : c)));
  const builtin = (id: string) => BUILTIN_CATS.some((b) => b.id === id);
  return (
    <Modal title="קטגוריות ביומן" onClose={onClose}>
      <div className="catlist">
        {list.map((c, i) => (
          <div key={c.id} className="catrow">
            <input value={c.label} maxLength={30} aria-label="שם הקטגוריה" onChange={(e) => set(i, { label: e.target.value })} />
            <div className="swatches" role="radiogroup" aria-label={`צבע ל${c.label}`}>
              {CAL_COLORS.map((col) => (
                <button key={col} type="button" role="radio" aria-checked={c.color === col} aria-label={COLOR_NAMES[col]} className={"sw c-" + col + (c.color === col ? " on" : "")} onClick={() => set(i, { color: col })} />
              ))}
            </div>
            {builtin(c.id) ? (
              <span className="muted" style={{ fontSize: 12 }}>קבועה</span>
            ) : (
              <button type="button" className="btn sm danger" onClick={() => setList((l) => l.filter((_, j) => j !== i))}>
                מחיקה
              </button>
            )}
          </div>
        ))}
      </div>
      {list.length < MAX_CATS && (
        <button type="button" className="link" style={{ marginTop: 10 }} onClick={() => setList((l) => [...l, { id: "k_" + uid(), label: "קטגוריה חדשה", color: CAL_COLORS[l.length % CAL_COLORS.length] }])}>
          + קטגוריה
        </button>
      )}
      <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>פריט שהקטגוריה שלו נמחקה חוזר לצבע של הסוג שלו (פגישה / אירוע / פולואפ).</p>
      <div className="mfoot">
        <button
          className="btn pri"
          onClick={async () => {
            await save("settings", { ...settings, calendar_cats: JSON.stringify(sanitizeCats(list)) });
            toast("הקטגוריות נשמרו");
            onClose();
          }}
        >
          שמירה
        </button>
      </div>
    </Modal>
  );
}
