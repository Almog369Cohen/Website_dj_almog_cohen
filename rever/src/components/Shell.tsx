"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePullSheet } from "./ImportSheet";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { initials, isDueToday } from "@/lib/format";
import type { Perm } from "@/lib/types";

const NAV: { href: string; e: string; label: string; perm?: Perm }[] = [
  { href: "/today", e: "☀️", label: "היום" },
  { href: "/leads", e: "👥", label: "לידים" },
  { href: "/calendar", e: "📅", label: "יומן" },
  { href: "/finance", e: "💰", label: "כספים", perm: "finance" },
  { href: "/messages", e: "💬", label: "הודעות" },
  { href: "/settings", e: "⚙️", label: "הגדרות", perm: "settings" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { db, settings, mode, toastMsg, error, ready, me, can } = useStore();
  const pull = usePullSheet();
  const pulled = useRef(false);
  // משיכה אוטומטית של לידים חדשים מהגיליון, פעם אחת בכל כניסה
  useEffect(() => {
    if (!ready || !me || pulled.current || !db.settings[0]?.sheet_url || !db.settings[0]?.sheet_auto) return;
    pulled.current = true;
    pull(true);
  }, [ready, me, db.settings, pull]);
  const { lock } = useAuth();

  if (!ready) return <div className="empty">טוען…</div>;
  if (!me)
    return (
      <div className="loginwrap">
        <div className="modal logincard">
          <h3>העובד הזה לא פעיל</h3>
          <p className="muted">ייתכן שהוסר או הושבת. בקשו מגל או מליאל.</p>
          <button className="btn pri" style={{ width: "100%" }} onClick={lock}>
            חזרה לבחירת עובד
          </button>
        </div>
      </div>
    );

  const due = db.leads.filter((l) => !["won", "lost"].includes(l.status) && isDueToday(l.next_followup)).length;
  const navItem = NAV.find((n) => path.startsWith(n.href));
  const blocked = navItem?.perm && !can(navItem.perm);

  return (
    <>
      <div className="app">
        <aside className="side">
          <div className="brand">
            <div className="logo">{(settings.business_name || "R").trim()[0]}</div>
            <div>
              <b>{settings.business_name || "העסק שלי"}</b>
              <small>מערכת ניהול</small>
            </div>
          </div>
          {NAV.filter((n) => !n.perm || can(n.perm)).map((n) => (
            <Link key={n.href} href={n.href} className={"nav" + (path.startsWith(n.href) ? " on" : "")}>
              <span className="e">{n.e}</span>
              {n.label}
              {n.href === "/today" && due > 0 && <span className="cnt">{due}</span>}
            </Link>
          ))}
          <div className="foot">
            {mode === "demo" && <span className="mode">מצב דמו · הנתונים נשמרים בדפדפן</span>}
            {mode === "sheets" && <span className="mode" style={{ color: "#7fd8a8" }}>● מחובר לגוגל שיטס</span>}
            <div className="userbox">
              <div className="av">{initials(me.name)}</div>
              <div style={{ minWidth: 0 }}>
                <b>{me.name}</b>
                <small>{me.role === "admin" ? "מאסטר" : me.title || "צוות"}</small>
              </div>
              <button className="ml switchbtn" onClick={lock} title="החלפת עובד">
                החלפה ⇄
              </button>
            </div>
          </div>
        </aside>
        <main className="main">
          <div className="mobilebar">
            <div className="logo">{(settings.business_name || "R").trim()[0]}</div>
            <b>{settings.business_name}</b>
            <span className="ml muted">{me.name}</span>
            <button className="btn sm" onClick={lock}>
              החלפה ⇄
            </button>
          </div>
          {error && <div className="banner err">לא הצלחתי לטעון נתונים: {error}</div>}
          {blocked ? (
            <div className="card empty">
              🔒 אין לך הרשאה למסך הזה. גל או ליאל יכולים לפתוח לך אותו בהגדרות.
              <div style={{ marginTop: 12 }}>
                <Link className="link" href="/today">
                  חזרה למסך היום
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </>
  );
}
