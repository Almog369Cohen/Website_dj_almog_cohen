"use client";

import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
}

export function KpiCard({ label, value, icon, trend }: KpiCardProps) {
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
        style={{ background: "rgba(5, 156, 192, 0.1)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted mb-1">{label}</p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
        {trend && (
          <p
            className="text-xs mt-1 font-medium"
            style={{ color: trend.positive ? "var(--accent-secondary)" : "var(--accent-danger)" }}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
