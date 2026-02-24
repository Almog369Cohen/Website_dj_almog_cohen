"use client";

import { useEventStore } from "@/stores/eventStore";
import { Check, MessageSquare, Music2, Sparkles, FileText } from "lucide-react";

const stages = [
  { id: 1, label: "שאלות", icon: MessageSquare },
  { id: 2, label: "שירים", icon: Music2 },
  { id: 3, label: "בקשות", icon: Sparkles },
  { id: 4, label: "סיכום", icon: FileText },
];

export function StageNav() {
  const event = useEventStore((s) => s.event);
  const setStage = useEventStore((s) => s.setStage);
  const currentStage = event?.currentStage ?? 0;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 justify-center">
      {stages.map((stage, i) => {
        const isCurrent = currentStage === stage.id;
        const isDone = currentStage > stage.id;
        const isFuture = currentStage < stage.id;
        const Icon = stage.icon;

        return (
          <div key={stage.id} className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => {
                if (!isFuture) setStage(stage.id);
              }}
              disabled={isFuture}
              className={`text-[11px] sm:text-xs font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all flex items-center gap-1.5 min-h-[32px] ${isCurrent
                ? "bg-brand-blue/15 border border-brand-blue/40 text-brand-blue backdrop-blur-sm shadow-gold-sm"
                : isDone
                  ? "bg-brand-green/15 text-brand-green cursor-pointer hover:bg-brand-green/25"
                  : "glass-card text-muted opacity-50 cursor-default"
                }`}
            >
              {isDone ? (
                <Check className="w-3 h-3" />
              ) : (
                <Icon className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">{stage.label}</span>
            </button>
            {i < stages.length - 1 && (
              <div
                className="w-3 sm:w-5 h-0.5 rounded-full flex-shrink-0 transition-colors"
                style={{
                  background: isDone
                    ? "var(--accent-secondary)"
                    : "var(--glass-border)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
