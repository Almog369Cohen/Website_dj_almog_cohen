"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { demoMembers, supabase } from "./repo";
import type { Member } from "./types";
import { initials } from "./format";

/**
 * כניסה בשני שלבים:
 * 1. המכשיר מחובר לחשבון הגוגל של העסק (פעם אחת).
 * 2. כל עובד בוחר את עצמו ומקיש קוד אישי. גל וליאל = קוד מאסטר.
 */
interface Auth {
  staffId: string;
  demo: boolean;
  /** החלפת עובד: חוזרים למסך הקוד */
  lock(): Promise<void>;
  /** ניתוק המכשיר מחשבון הגוגל */
  signOutGoogle(): Promise<void>;
}
const Ctx = createContext<Auth | null>(null);
const DEMO_KEY = "rever-demo-staff";

type Stage = "loading" | "google" | "pick" | "in";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sb = supabase();
  const demo = !sb;
  const [stage, setStage] = useState<Stage>("loading");
  const [staffId, setStaffId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const checkStaff = useCallback(async () => {
    if (demo) {
      let id: string | null = null;
      try {
        id = sessionStorage.getItem(DEMO_KEY);
      } catch {}
      const ok = id && demoMembers().some((m) => m.id === id && m.active);
      setStaffId(ok ? id : null);
      setStage(ok ? "in" : "pick");
      return;
    }
    const res = await fetch("/api/session", { credentials: "same-origin" });
    const data = await res.json().catch(() => ({}));
    if (data.me) {
      setStaffId(data.me.id);
      setStage("in");
    } else setStage("pick");
  }, [demo]);

  useEffect(() => {
    if (demo) {
      checkStaff();
      return;
    }
    const apply = (s: { access_token: string } | null) => {
      setToken(s?.access_token ?? null);
      if (!s) setStage("google");
      else checkStaff();
    };
    sb!.auth.getSession().then(({ data }) => apply(data.session));
    const { data } = sb!.auth.onAuthStateChange((_e, s) => {
      setToken(s?.access_token ?? null);
      if (!s) setStage("google");
    });
    const onOut = () => setStage("pick");
    window.addEventListener("rever:signed-out", onOut);
    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener("rever:signed-out", onOut);
    };
  }, [sb, demo, checkStaff]);

  const lock = async () => {
    if (demo) {
      try {
        sessionStorage.removeItem(DEMO_KEY);
      } catch {}
    } else await fetch("/api/session", { method: "DELETE", credentials: "same-origin" });
    setStaffId(null);
    setStage("pick");
  };

  if (stage === "loading") return <div className="empty">טוען…</div>;
  if (stage === "google") return <GoogleLogin />;
  if (stage === "pick" || !staffId)
    return (
      <StaffPicker
        demo={demo}
        token={token}
        onDone={(id) => {
          if (demo) {
            try {
              sessionStorage.setItem(DEMO_KEY, id);
            } catch {}
          }
          setStaffId(id);
          setStage("in");
        }}
        onSignOutGoogle={async () => {
          await sb?.auth.signOut();
        }}
      />
    );
  return (
    <Ctx.Provider value={{ staffId, demo, lock, signOutGoogle: async () => {
          await lock();
          await sb?.auth.signOut();
        } }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const a = useContext(Ctx);
  if (!a) throw new Error("useAuth outside provider");
  return a;
};

/* ---------------- שלב 1: חשבון גוגל של העסק ---------------- */
function GoogleLogin() {
  const sb = supabase()!;
  const [err, setErr] = useState("");
  return (
    <div className="loginwrap">
      <div className="modal logincard">
        <div className="logo big">ר</div>
        <div>
          <h3>רבר הפקות</h3>
          <div className="muted" style={{ marginTop: 4 }}>מערכת ניהול</div>
        </div>
        <button
          className="btn gbtn"
          onClick={async () => {
            setErr("");
            const { error } = await sb.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: window.location.origin + "/today", queryParams: { prompt: "select_account" } },
            });
            if (error) setErr(error.message);
          }}
        >
          <GoogleIcon /> כניסה עם חשבון הגוגל של רבר
        </button>
        {err && <div className="banner err">{err}</div>}
        <div className="muted" style={{ fontSize: 13 }}>אחרי הכניסה כל עובד בוחר את עצמו ומקיש קוד אישי.</div>
      </div>
    </div>
  );
}

/* ---------------- שלב 2: בחירת עובד + קוד ---------------- */
type Staff = Pick<Member, "id" | "name" | "title" | "role" | "has_pin">;

function StaffPicker({
  demo,
  token,
  onDone,
  onSignOutGoogle,
}: {
  demo: boolean;
  token: string | null;
  onDone: (id: string) => void;
  onSignOutGoogle: () => Promise<void>;
}) {
  const [staff, setStaff] = useState<Staff[] | null>(null);
  const [setup, setSetup] = useState(false);
  const [sel, setSel] = useState<Staff | null>(null);
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (demo) {
      setStaff(demoMembers().filter((m) => m.active));
      return;
    }
    fetch("/api/staff", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setStaff(d.staff);
        setSetup(d.setup);
      })
      .catch((e) => setErr(e.message));
  }, [demo, token]);

  const submit = async (code: string) => {
    if (!sel || busy) return;
    setBusy(true);
    setErr("");
    try {
      if (demo) {
        const m = demoMembers().find((x) => x.id === sel.id);
        if (m?.pin === code) return onDone(sel.id);
        throw new Error("קוד שגוי");
      }
      const r = await fetch("/api/session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ staff_id: sel.id, pin: code }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      onDone(sel.id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setPin("");
    } finally {
      setBusy(false);
    }
  };

  const press = (k: string) => {
    if (k === "⌫") return setPin((p) => p.slice(0, -1));
    const next = (pin + k).slice(0, 8);
    setPin(next);
    if (next.length === 4 && demo) submit(next);
  };

  // הגדרה ראשונה (אין עובדים)
  if (setup)
    return (
      <div className="loginwrap">
        <form
          className="modal logincard"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr("");
            const r = await fetch("/api/staff", {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ name, pin }),
            });
            const d = await r.json();
            if (!r.ok) return setErr(d.error);
            onDone(d.id);
          }}
        >
          <div className="logo big">ר</div>
          <h3>הגדרה ראשונה</h3>
          <p className="muted">יוצרים את המנהל הראשון עם קוד מאסטר. אחר כך מוסיפים את שאר הצוות בהגדרות.</p>
          <input className="search" style={{ width: "100%" }} placeholder="שם (למשל: גל)" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="search" style={{ width: "100%" }} placeholder="קוד מאסטר (4-8 ספרות)" inputMode="numeric" type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} required minLength={4} maxLength={8} />
          {err && <div className="banner err">{err}</div>}
          <button className="btn pri" style={{ width: "100%" }}>יצירה וכניסה</button>
        </form>
      </div>
    );

  return (
    <div className="loginwrap">
      <div className="modal logincard" style={{ width: "min(460px,100%)" }}>
        <div className="logo big">ר</div>
        {!sel ? (
          <>
            <div>
              <h3>מי נכנס?</h3>
              <div className="muted" style={{ marginTop: 4 }}>בחרו את השם שלכם</div>
            </div>
            {!staff && !err && <div className="muted">טוען…</div>}
            <div className="staffgrid">
              {staff?.map((s) => (
                <button key={s.id} className="staffbtn" onClick={() => (setSel(s), setPin(""), setErr(""))}>
                  <div className={"av" + (s.role === "admin" ? " gold" : "")}>{initials(s.name)}</div>
                  <b>{s.name}</b>
                  <small>{s.role === "admin" ? "מאסטר" : s.title || "צוות"}</small>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <h3>שלום {sel.name}</h3>
              <div className="muted" style={{ marginTop: 4 }}>{sel.has_pin === false ? "עוד לא הוגדר לך קוד. בקשו מגל או מליאל." : "הקישו את הקוד האישי"}</div>
            </div>
            <div className="pindots" aria-label="קוד">
              {Array.from({ length: Math.max(4, pin.length) }, (_, i) => (
                <span key={i} className={i < pin.length ? "on" : ""} />
              ))}
            </div>
            <div className="pinpad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map((k) => (
                <button
                  key={k}
                  className={"pinkey" + (k === "✓" ? " ok" : "")}
                  disabled={busy || (k === "✓" && pin.length < 4)}
                  onClick={() => (k === "✓" ? submit(pin) : press(k))}
                >
                  {k}
                </button>
              ))}
            </div>
            <input
              className="sr"
              autoFocus
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
              onKeyDown={(e) => e.key === "Enter" && pin.length >= 4 && submit(pin)}
              aria-label="קוד אישי"
            />
            <button className="link" onClick={() => setSel(null)}>
              → זה לא אני
            </button>
          </>
        )}
        {err && <div className="banner err">{err}</div>}
        {!demo && (
          <button className="muted" style={{ fontSize: 12.5 }} onClick={onSignOutGoogle}>
            ניתוק המכשיר מחשבון הגוגל
          </button>
        )}
        {demo && <div className="banner" style={{ fontSize: 12.5 }}>מצב דמו · קודים: גל 1111 · ליאל 2222 · ארד 3333 · ספיר 4444</div>}
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);
