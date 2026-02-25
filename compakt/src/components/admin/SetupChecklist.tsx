"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from "lucide-react";
import { useDJStore } from "@/stores/djStore";
import { supabase } from "@/lib/supabase/client";

interface ChecklistStep {
  id: string;
  label: string;
  description: string;
  done: boolean;
  action?: string; // tab to navigate to
}

const DISMISSED_KEY = "compakt.setup.dismissed";

export function SetupChecklist({
  onNavigate,
}: {
  onNavigate: (tab: string) => void;
}) {
  const profile = useDJStore((s) => s.profile);
  const [songCount, setSongCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(true); // default hidden until checked
  const [collapsed, setCollapsed] = useState(false);

  // Check if dismissed
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DISMISSED_KEY);
      setDismissed(raw === "true");
    } catch {
      setDismissed(false);
    }
  }, []);

  // Fetch counts
  const fetchCounts = useCallback(async () => {
    if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    const bearer = session.session?.access_token;
    if (!bearer) return;

    const [songsRes, eventsRes] = await Promise.all([
      fetch("/api/songs", { headers: { Authorization: `Bearer ${bearer}` } }),
      fetch("/api/events", { headers: { Authorization: `Bearer ${bearer}` } }),
    ]);

    if (songsRes.ok) {
      const { songs } = await songsRes.json();
      setSongCount(Array.isArray(songs) ? songs.length : 0);
    }
    if (eventsRes.ok) {
      const { events } = await eventsRes.json();
      setEventCount(Array.isArray(events) ? events.length : 0);
    }
  }, []);

  useEffect(() => {
    if (!dismissed) fetchCounts();
  }, [dismissed, fetchCounts]);

  const steps: ChecklistStep[] = [
    {
      id: "profile",
      label: "השלימו פרופיל",
      description: "שם עסק, סלוגן וצבע מותג",
      done: Boolean(profile?.djSlug && profile?.businessName),
      action: "settings",
    },
    {
      id: "songs",
      label: "הוסיפו שירים",
      description: "לפחות 10 שירים לספריית הסווייפ",
      done: (songCount ?? 0) >= 10,
      action: "songs",
    },
    {
      id: "questions",
      label: "התאימו שאלות",
      description: "עברו על השאלות ללקוחות שלכם",
      done: Boolean(profile?.djSlug), // considered done if profile is set (questions have defaults)
      action: "questions",
    },
    {
      id: "event",
      label: "צרו אירוע ראשון",
      description: "צרו אירוע ושלחו לינק ללקוח",
      done: (eventCount ?? 0) > 0,
      action: "events",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  // Auto-dismiss when all done
  useEffect(() => {
    if (allDone && !dismissed) {
      setTimeout(() => {
        setDismissed(true);
        try { localStorage.setItem(DISMISSED_KEY, "true"); } catch { /* */ }
      }, 3000);
    }
  }, [allDone, dismissed]);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card p-4 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-blue" />
          <h3 className="text-sm font-bold">
            {allDone ? "הכל מוכן! 🎉" : `מתחילים — ${completedCount}/${steps.length}`}
          </h3>
          {/* Progress bar */}
          <div className="w-20 h-1.5 rounded-full overflow-hidden bg-glass">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / steps.length) * 100}%`,
                background: allDone ? "#03b28c" : "#059cc0",
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setDismissed(true);
              try { localStorage.setItem(DISMISSED_KEY, "true"); } catch { /* */ }
            }}
            className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
            title="סגור"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => step.action && onNavigate(step.action)}
                  className={`p-3 rounded-xl border text-right transition-all ${
                    step.done
                      ? "border-brand-green/30 bg-brand-green/5"
                      : "border-glass hover:border-brand-blue/30 hover:bg-brand-blue/5"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {step.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${step.done ? "text-brand-green" : ""}`}>
                      {step.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted pr-5">{step.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
