"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
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
        <h1 className="text-xl font-bold mb-2">אין הרשאה</h1>
        <p className="text-sm text-secondary mb-6">
          אין לך גישה לעמוד הזה. אם אתה חושב שזו טעות, פנה למנהל המערכת.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary inline-block px-6 py-3">
            עמוד ראשי
          </Link>
          <Link href="/admin" className="btn-secondary inline-block px-6 py-3">
            כניסה לאדמין
          </Link>
          <Link href="/staff" className="btn-secondary inline-block px-6 py-3">
            כניסה לצוות
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
