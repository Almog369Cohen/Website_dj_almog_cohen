"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, UserPlus, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/admin");
      }
    });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Supabase לא מוגדר");
      return;
    }

    setBusy(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim() || undefined,
          },
          emailRedirectTo: `${origin}/admin`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setBusy(false);
        return;
      }

      // If email confirmation is enabled, session may be null.
      if (!data.session) {
        setSuccess(true);
        setBusy(false);
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-card p-8 w-full max-w-sm"
      >
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          חזרה לחבילות
        </Link>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-brand-green" />
            </div>
            <h1 className="font-display text-xl font-black mb-2">כמעט סיימנו</h1>
            <p className="text-sm text-secondary">
              שלחנו לך מייל לאימות. אחרי האימות — חזור לאתר והתחבר.
            </p>
            <Link href="/admin" className="btn-primary w-full mt-6 inline-block text-center">
              כניסה לאדמין
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 bg-brand-blue/15 border border-brand-blue/30">
                <UserPlus className="w-6 h-6 text-brand-blue" />
              </div>
              <h1 className="font-display text-2xl font-black">פתיחת משתמש</h1>
              <p className="text-sm text-secondary mt-1">התחלה מהירה — אחר כך עושים onboarding</p>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-xs text-muted mb-1">שם מלא (אופציונלי)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="DJ Almog"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs text-muted mb-1">אימייל *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  dir="ltr"
                  className="input-field"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs text-muted mb-1">סיסמה *</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="לפחות 6 תווים"
                    dir="ltr"
                    className="input-field pr-4 pl-11"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                    aria-label={showPwd ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs" style={{ color: "var(--accent-danger)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                פתח משתמש
              </button>

              <p className="text-xs text-muted text-center">
                פתיחת משתמש יוצרת רשומה ב-DB אוטומטית דרך trigger.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
