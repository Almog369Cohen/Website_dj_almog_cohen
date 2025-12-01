"use client";

/**
 * עמוד תצוגה מקדימה לסגנונות UI
 * נפרד מדף הבית - לא משפיע על האתר
 */

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting
const HomeBridalGlass = dynamic(() => import("@/components/home/styles/HomeBridalGlass"), { ssr: false });
const HomeMinimal = dynamic(() => import("@/components/home/styles/HomeMinimal"), { ssr: false });
const HomeGlass = dynamic(() => import("@/components/home/styles/HomeGlass"), { ssr: false });
const HomeBrutalist = dynamic(() => import("@/components/home/styles/HomeBrutalist"), { ssr: false });
const HomeNeon = dynamic(() => import("@/components/home/styles/HomeNeon"), { ssr: false });
const HomeElegant = dynamic(() => import("@/components/home/styles/HomeElegant"), { ssr: false });

const styles = [
  { id: "bridal", name: "🌸 Bridal Glass", desc: "זכוכית יוקרתית לכלות", component: HomeBridalGlass },
  { id: "minimal", name: "⬜ Minimal", desc: "נקי ומינימליסטי", component: HomeMinimal },
  { id: "glass", name: "💎 Glassmorphism", desc: "אפקט זכוכית מט", component: HomeGlass },
  { id: "brutalist", name: "🔳 Brutalist", desc: "גס ואמיץ", component: HomeBrutalist },
  { id: "neon", name: "💜 Neon", desc: "סייברפאנק וזוהר", component: HomeNeon },
  { id: "elegant", name: "👑 Elegant", desc: "יוקרה קלאסית", component: HomeElegant },
];

export default function PreviewPage() {
  const [activeStyle, setActiveStyle] = useState("bridal");
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const ActiveComponent = styles.find(s => s.id === activeStyle)?.component || HomeBridalGlass;

  return (
    <div className="relative min-h-screen">
      {/* Floating Style Selector */}
      <div className={`fixed top-4 left-4 z-[100] transition-all duration-300 ${isMenuOpen ? 'w-72' : 'w-auto'}`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute -right-12 top-0 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center shadow-lg backdrop-blur-sm hover:bg-black transition-colors"
        >
          {isMenuOpen ? '✕' : '🎨'}
        </button>

        {isMenuOpen && (
          <div className="bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">🎨 Style Preview</h2>
              <p className="text-white/50 text-xs mt-1">בחרו סגנון לתצוגה מקדימה</p>
            </div>
            
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setActiveStyle(style.id)}
                  className={`w-full text-right p-3 rounded-xl mb-1 transition-all ${
                    activeStyle === style.id
                      ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{style.name.split(' ')[0]}</span>
                    <div>
                      <div className={`font-medium ${activeStyle === style.id ? 'text-rose-300' : 'text-white'}`}>
                        {style.name.split(' ').slice(1).join(' ')}
                      </div>
                      <div className="text-xs text-white/40">{style.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <p className="text-white/30 text-xs text-center">
                💡 הסגנון הנבחר: <span className="text-rose-300">{styles.find(s => s.id === activeStyle)?.name}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Active Style Component */}
      <ActiveComponent />
    </div>
  );
}
