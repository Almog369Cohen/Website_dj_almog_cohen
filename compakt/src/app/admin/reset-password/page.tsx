"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { hebrewAuthError } from "@/lib/auth/errors-he";
import { supabase } from "@/lib/supabase/client";
import { useAuthService } from "@/services";

export default function ResetPasswordPage() {
  const auth = useAuthService();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;

    void supabase.auth.exchangeCodeForSession(window.location.href);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("הסיסמה חייבת להיות לפחות 8 תווים");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    setIsBusy(true);
    const res = await auth.updatePassword(newPassword);
    if (!res.ok) {
      setError(hebrewAuthError(res.error));
      setIsBusy(false);
      return;
    }

    setSuccess(true);
    setIsBusy(false);
  };

  return (
    <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
        className="glass-card p-8 w-full max-w-sm text-center"
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg, #059cc0, #03b28c)" }}
        >
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold mb-1">איפוס סיסמה</h1>
        <p className="text-sm text-secondary mb-6">בחרו סיסמה חדשה</p>

        <div className="relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="סיסמה חדשה"
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors pr-11"
            autoComplete="new-password"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <PasswordStrength password={newPassword} />

        <div className="mb-4 mt-3">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="אישור סיסמה"
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-glass text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-blue transition-colors"
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text-xs mb-3" style={{ color: "var(--accent-danger)" }}>
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs mb-3" style={{ color: "var(--accent-success)" }}>
            הסיסמה עודכנה. אפשר לחזור לדף האדמין.
          </p>
        )}

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={isBusy}>
          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          שמירה
        </button>

        <a href="/admin" className="block mt-3 text-sm text-secondary hover:text-foreground transition-colors">
          חזרה לאדמין
        </a>
      </motion.form>
    </div>
  );
}
