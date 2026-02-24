"use client";

import { useEventStore } from "@/stores/eventStore";
import { EventSetup } from "@/components/stages/EventSetup";
import { QuestionFlow } from "@/components/stages/QuestionFlow";
import { SongTinder } from "@/components/stages/SongTinder";
import { DreamsRequests } from "@/components/stages/DreamsRequests";
import { MusicBrief } from "@/components/stages/MusicBrief";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StageNav } from "@/components/ui/StageNav";
import { HydrationGuard } from "@/components/ui/HydrationGuard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

function JourneyApp() {
  const event = useEventStore((s) => s.event);
  const theme = useEventStore((s) => s.theme);
  const loadEvent = useEventStore((s) => s.loadEvent);
  const reset = useEventStore((s) => s.reset);
  const currentStage = event?.currentStage ?? 0;
  const [showReset, setShowReset] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load event from magic link URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      loadEvent(token);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [loadEvent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    reset();
    setShowReset(false);
    setShowResetConfirm(false);
  };

  const stageKey = !event ? "setup" : `stage-${currentStage}`;

  const renderStage = () => {
    if (!event) return <EventSetup />;
    switch (currentStage) {
      case 0: return <EventSetup />;
      case 1: return <QuestionFlow />;
      case 2: return <SongTinder />;
      case 3: return <DreamsRequests />;
      case 4: return <MusicBrief />;
      default: return <EventSetup />;
    }
  };

  return (
    <main className="min-h-dvh gradient-hero relative">
      <AmbientBackground />
      {/* Top Controls */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        {event && (
          <button
            onClick={() => setShowReset(!showReset)}
            className="glass-card p-2 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="התחל מחדש"
          >
            <RotateCcw className="w-5 h-5 text-muted" />
          </button>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        open={showResetConfirm}
        title="להתחיל מחדש?"
        description="כל הנתונים יימחקו — שאלות, שירים ובקשות"
        icon={<RotateCcw className="w-8 h-8 text-muted" />}
        confirmText="כן, מחק הכל"
        cancelText="חזרה"
        danger
        onConfirm={confirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Stage Navigation */}
      {event && currentStage > 0 && currentStage <= 4 && (
        <div className="fixed top-4 right-4 left-28 z-40">
          <StageNav />
        </div>
      )}

      {/* Stage Content with transitions */}
      <div className="flex items-center justify-center min-h-dvh px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={stageKey}
            initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            <ErrorBoundary>
              {renderStage()}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <HydrationGuard>
      <JourneyApp />
    </HydrationGuard>
  );
}
