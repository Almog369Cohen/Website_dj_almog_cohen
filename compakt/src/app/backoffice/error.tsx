"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BackofficeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[backoffice] Page error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="glass-card p-8 w-full max-w-md text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
          style={{ background: "rgba(255,68,102,0.12)" }}
        >
          <AlertTriangle className="w-6 h-6" style={{ color: "var(--accent-danger)" }} />
        </div>
        <h2 className="text-lg font-bold mb-2">שגיאה בטעינת הדף</h2>
        <p className="text-sm text-secondary mb-6">
          {error.message || "אירעה שגיאה לא צפויה. נסה לטעון מחדש."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            נסה שוב
          </button>
          <Link
            href="/backoffice"
            className="btn-secondary flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לדשבורד
          </Link>
        </div>
      </div>
    </div>
  );
}
