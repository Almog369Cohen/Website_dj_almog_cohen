"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PlaylistsPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
  const wa = (txt: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(txt)}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-blue/10" />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            פלייליסטים
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 mb-8"
          >
            האזינו לסטים ופלייליסטים שלי
          </motion.p>
        </div>
      </section>

      {/* Playlists Grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards - will be replaced with actual playlists */}
            {[
              { title: "חתונות 2024", description: "הלהיטים הכי חמים לרחבה", platform: "Spotify" },
              { title: "בר מצוות", description: "מיקס אנרגטי לאירועים", platform: "Spotify" },
              { title: "מזרחית על הבוקר", description: "להתחיל את היום נכון", platform: "YouTube" },
              { title: "אלקטרוניקה", description: "סטים מהמועדונים", platform: "SoundCloud" },
              { title: "שנות ה-90", description: "נוסטלגיה ברחבה", platform: "Spotify" },
              { title: "היפ הופ ישראלי", description: "הקטעים הכי טובים", platform: "YouTube" },
            ].map((playlist, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-brand-green/30 transition-all"
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-brand-green/20 to-brand-blue/20 mb-4 flex items-center justify-center">
                  <span className="text-4xl opacity-50">🎵</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{playlist.title}</h3>
                <p className="text-white/60 text-sm mb-3">{playlist.description}</p>
                <span className="text-xs text-brand-green">{playlist.platform}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-white/60 mb-6">רוצים פלייליסט מותאם אישית לאירוע?</p>
            <a
              href={wa("היי אלמוג, אשמח לקבל פלייליסט מותאם לאירוע שלי")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-green to-brand-blue rounded-full font-bold hover:scale-105 transition-transform"
            >
              דברו איתי
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
