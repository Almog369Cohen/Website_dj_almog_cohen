"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldX, RefreshCw, LogIn, Home, UserCog, Loader2 } from "lucide-react";

const REASON_MESSAGES: Record<string, { title: string; description: string }> = {
  not_staff: {
    title: "הגישה לצוות בלבד",
    description: "המשתמש שלך לא מוגדר כאיש צוות. אם אתה DJ, נסה להתחבר דרך כניסת האדמין.",
  },
  no_profile: {
    title: "פרופיל לא נמצא",
    description: "חשבון המשתמש קיים אבל הפרופיל לא נוצר במערכת. פנה למנהל המערכת.",
  },
  error: {
    title: "שגיאת מערכת",
    description: "אירעה שגיאה בבדיקת ההרשאות. נסה שוב או פנה למנהל.",
  },
};

const DEFAULT_MESSAGE = {
  title: "אין הרשאה",
  description: "אין לך גישה לעמוד הזה. אם אתה חושב שזו טעות, פנה למנהל המערכת.",
};

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") ?? "";
  const from = searchParams.get("from") ?? "/backoffice";
  const message = REASON_MESSAGES[reason] ?? DEFAULT_MESSAGE;

  const staffLoginUrl = `/staff?redirect=${encodeURIComponent(from)}`;

  return (
    <div className="min-h-dvh gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-sm text-center"
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "linear-gradient(135deg, #ff4466, #e53e5c)" }}
        >
          <ShieldX className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold mb-2">{message.title}</h1>
        <p className="text-sm text-secondary mb-6">{message.description}</p>

        <div className="flex flex-col gap-3">
          <Link
            href={staffLoginUrl}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3"
          >
            <LogIn className="w-4 h-4" />
            כניסה לצוות
          </Link>

          {reason === "not_staff" && (
            <Link
              href="/admin"
              className="btn-secondary flex items-center justify-center gap-2 px-6 py-3"
            >
              <UserCog className="w-4 h-4" />
              כניסה לאדמין DJ
            </Link>
          )}

          <div className="flex gap-3 justify-center mt-1">
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-secondary hover:text-foreground transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              נסה שוב
            </button>
            <Link
              href="/"
              className="text-sm text-secondary hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="w-3 h-3" />
              עמוד ראשי
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
