"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/repo";
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
  const { email, demo, signOut, setDemoUser } = useAuth();

  if (!ready) return <div className="empty">טוען…</div>;
  if (!me) return <NoAccess email={email} demo={demo} onSignOut={signOut} />;

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
            {mode === "demo" && (
              <>
                <span className="mode">מצב דמו · הנתונים נשמרים בדפדפן</span>
                <select className="demo-user" value={me.id} onChange={(e) => setDemoUser(e.target.value)} aria-label="צפייה בתור">
                  {db.members.map((m) => (
                    <option key={m.id} value={m.id}>
                      צפייה בתור: {m.name} ({m.role === "admin" ? "מנהל" : "צוות"})
                    </option>
                  ))}
                </select>
              </>
            )}
            <div className="userbox">
              <div className="av">{initials(me.name)}</div>
              <div style={{ minWidth: 0 }}>
                <b>{me.name}</b>
                <small>{me.role === "admin" ? "מנהל · הרשאות מלאות" : "צוות"}</small>
              </div>
              {!demo && (
                <button className="ml" style={{ color: "#9aa1ad", fontSize: 12.5 }} onClick={signOut}>
                  יציאה
                </button>
              )}
            </div>
          </div>
        </aside>
        <main className="main">
          {error && <div className="banner err">לא הצלחתי לטעון נתונים: {error}</div>}
          {blocked ? (
            <div className="card empty">
              🔒 אין לך הרשאה למסך הזה. אפשר לבקש מגל או מליאל.
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

function NoAccess({ email, demo, onSignOut }: { email: string | null; demo: boolean; onSignOut: () => Promise<void> }) {
  const { reload } = useStore();
  // RLS מסתיר את רשימת המשתמשים ממי שלא רשום, לכן שואלים את השרת אם יש משתמשים בכלל
  const [firstUser, setFirstUser] = useState(false);
  useEffect(() => {
    if (demo) return;
    supabase()!
      .rpc("members_exist")
      .then(({ data }) => setFirstUser(data === false));
  }, [demo]);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="loginwrap">
      <div className="modal" style={{ width: "min(440px,100%)", textAlign: "center", alignItems: "center", gap: 16 }}>
        <div className="logo" style={{ width: 56, height: 56, fontSize: 26 }}>ר</div>
        {firstUser ? (
          <>
            <h3>הגדרה ראשונה</h3>
            <p className="muted">אין עדיין משתמשים במערכת. החשבון {email} יהיה המנהל הראשון, ואחר כך תוכלו להוסיף את שאר הצוות.</p>
            <input className="search" style={{ width: "100%" }} placeholder="השם שלך (למשל: גל)" value={name} onChange={(e) => setName(e.target.value)} />
            {err && <div className="banner err">{err}</div>}
            <button
              className="btn pri"
              style={{ width: "100%" }}
              disabled={!name.trim()}
              onClick={async () => {
                const { error } = await supabase()!.rpc("claim_first_admin", { p_name: name.trim() });
                if (error) setErr(error.message);
                else await reload();
              }}
            >
              להיכנס כמנהל
            </button>
          </>
        ) : (
          <>
            <h3>אין לך עדיין גישה</h3>
            <p className="muted">
              נכנסת עם {email}. החשבון הזה לא רשום במערכת. בקשו מגל או מליאל להוסיף אותו בהגדרות ← צוות והרשאות.
            </p>
          </>
        )}
        <button className="btn" style={{ width: "100%" }} onClick={onSignOut}>
          כניסה עם חשבון אחר
        </button>
      </div>
    </div>
  );
}
