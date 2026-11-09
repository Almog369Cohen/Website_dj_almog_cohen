"use client";
import { useEffect } from "react";
import type { LeadStatus } from "@/lib/types";
import { statusLabel } from "@/lib/types";

export function StatusTag({ s }: { s: LeadStatus }) {
  return <span className={"tag s-" + s}>{s === "won" ? statusLabel(s) + " ✓" : statusLabel(s)}</span>;
}

const AV: Record<LeadStatus, [string, string]> = {
  new: ["var(--bluebg)", "var(--blue)"],
  talk: ["var(--orangebg)", "var(--orange)"],
  meeting: ["var(--violetbg)", "var(--violet)"],
  quote: ["var(--goldbg)", "var(--gold)"],
  won: ["var(--greenbg)", "var(--green)"],
  lost: ["#f0f1f3", "var(--muted)"],
};
export function Avatar({ text, s, late }: { text: string; s: LeadStatus; late?: boolean }) {
  const [bg, fg] = late ? ["var(--redbg)", "var(--red)"] : AV[s];
  return (
    <div className="av" style={{ background: bg, color: fg }}>
      {text}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-label={title}>
        <div className="row">
          <h3>{title}</h3>
          <button className="ib ml" onClick={onClose} aria-label="סגירה">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={"f" + (full ? " full" : "")}>
      <label>{label}</label>
      {children}
    </div>
  );
}

/** תג קטן עם שם העובד שמטפל */
export function Owner({ name, mine }: { name?: string; mine?: boolean }) {
  if (!name) return <span className="owner none">לא משויך</span>;
  return <span className={"owner" + (mine ? " mine" : "")}>👤 {name}</span>;
}
