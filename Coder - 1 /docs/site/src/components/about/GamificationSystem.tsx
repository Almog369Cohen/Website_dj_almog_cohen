"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
}

export default function GamificationSystem({ 
  scrollProgress = 0,
  timeOnPage = 0,
  sectionsVisited = 0
}: { 
  scrollProgress: number;
  timeOnPage: number;
  sectionsVisited: number;
}) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_scroll',
      title: 'התחלה טובה',
      description: 'גללת את העמוד לראשונה',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      total: 1
    },
    {
      id: 'explorer',
      title: 'חוקר',
      description: 'ביקרת ב-3 סקשנים שונים',
      icon: '🗺️',
      unlocked: false,
      progress: 0,
      total: 3
    },
    {
      id: 'engaged',
      title: 'מעורב',
      description: 'בילית 2 דקות בעמוד',
      icon: '⏱️',
      unlocked: false,
      progress: 0,
      total: 120
    },
    {
      id: 'completionist',
      title: 'פרפקציוניסט',
      description: 'הגעת לסוף העמוד',
      icon: '🏆',
      unlocked: false,
      progress: 0,
      total: 1
    },
    {
      id: 'speed_demon',
      title: 'מהיר כברק',
      description: 'סיימת את העמוד בפחות מ-60 שניות',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      total: 1
    }
  ]);

  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);
  const [easterEggFound, setEasterEggFound] = useState(false);

  // Check achievements
  useEffect(() => {
    setAchievements(prev => prev.map(ach => {
      let newAch = { ...ach };

      // First scroll
      if (ach.id === 'first_scroll' && scrollProgress > 0.01 && !ach.unlocked) {
        newAch.progress = 1;
        newAch.unlocked = true;
        triggerUnlock(newAch);
      }

      // Explorer
      if (ach.id === 'explorer') {
        newAch.progress = sectionsVisited;
        if (sectionsVisited >= 3 && !ach.unlocked) {
          newAch.unlocked = true;
          triggerUnlock(newAch);
        }
      }

      // Engaged
      if (ach.id === 'engaged') {
        newAch.progress = timeOnPage;
        if (timeOnPage >= 120 && !ach.unlocked) {
          newAch.unlocked = true;
          triggerUnlock(newAch);
        }
      }

      // Completionist
      if (ach.id === 'completionist' && scrollProgress > 0.95 && !ach.unlocked) {
        newAch.progress = 1;
        newAch.unlocked = true;
        triggerUnlock(newAch);
      }

      // Speed demon
      if (ach.id === 'speed_demon' && scrollProgress > 0.95 && timeOnPage < 60 && !ach.unlocked) {
        newAch.progress = 1;
        newAch.unlocked = true;
        triggerUnlock(newAch);
      }

      return newAch;
    }));
  }, [scrollProgress, timeOnPage, sectionsVisited]);

  // Trigger unlock animation + confetti
  const triggerUnlock = (achievement: Achievement) => {
    setNewUnlock(achievement);
    
    // Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059cc0', '#03b28c', '#ffffff']
    });

    // Hide after 3 seconds
    setTimeout(() => setNewUnlock(null), 3000);
  };

  // Easter egg: Konami code (↑↑↓↓←→←→BA)
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setEasterEggFound(true);
          confetti({
            particleCount: 200,
            spread: 180,
            origin: { y: 0.5 },
            colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']
          });
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <>
      {/* Achievements Panel (Toggle) */}
      <div className="fixed left-8 top-1/2 z-50 -translate-y-1/2">
        <button
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-green/40 bg-black/60 backdrop-blur-md transition-all hover:scale-110 hover:border-brand-green hover:bg-black/80 hover:shadow-[0_0_30px_rgba(3,178,140,0.5)]"
          aria-label="Achievements"
        >
          <span className="text-xl">{unlockedCount === totalCount ? '🏆' : '🎯'}</span>
          
          {/* Counter badge */}
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-black">
            {unlockedCount}
          </div>

          {/* Achievements dropdown */}
          <div className="absolute left-full ml-4 hidden w-64 rounded-2xl border border-brand-green/20 bg-black/90 p-4 backdrop-blur-xl group-hover:block">
            <h3 className="mb-3 text-sm font-bold text-brand-green">הישגים ({unlockedCount}/{totalCount})</h3>
            <div className="space-y-2">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`rounded-lg p-2 text-right ${
                    ach.unlocked 
                      ? 'bg-brand-green/10 border border-brand-green/20' 
                      : 'bg-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg">{ach.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">{ach.title}</p>
                      <p className="text-xs text-white/60">{ach.description}</p>
                      {!ach.unlocked && ach.total > 1 && (
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-brand-green transition-all duration-300"
                            style={{ width: `${(ach.progress / ach.total) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </button>
      </div>

      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {newUnlock && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed left-1/2 top-8 z-50 -translate-x-1/2"
          >
            <div className="rounded-2xl border-2 border-brand-green bg-black/90 p-6 shadow-[0_0_40px_rgba(3,178,140,0.6)] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{newUnlock.icon}</span>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">הישג חדש!</p>
                  <p className="text-lg font-bold text-white">{newUnlock.title}</p>
                  <p className="text-sm text-white/70">{newUnlock.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {easterEggFound && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={() => setEasterEggFound(false)}
          >
            <div className="max-w-md rounded-3xl border-2 border-brand-blue bg-gradient-to-br from-brand-blue/20 to-brand-green/20 p-8 text-center">
              <p className="mb-4 text-6xl">🎮</p>
              <h2 className="mb-2 text-2xl font-black text-white">מצאת את Konami Code!</h2>
              <p className="mb-4 text-white/80">
                גיימר אמיתי! תקבל 20% הנחה על ההזמנה הבאה שלך.
              </p>
              <p className="text-xs text-brand-blue">קוד קופון: KONAMI2025</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
