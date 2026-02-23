"use client";

import { useMemo } from "react";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "transparent" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: "חלשה", color: "var(--accent-danger)" };
  if (score <= 3) return { score: 2, label: "בינונית", color: "var(--accent-gold)" };
  if (score <= 4) return { score: 3, label: "טובה", color: "var(--accent-primary)" };
  return { score: 4, label: "חזקה", color: "var(--accent-secondary)" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-1.5 mb-1">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? color : "var(--glass-border)",
            }}
          />
        ))}
      </div>
      <p className="text-xs text-left" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
