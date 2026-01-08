"use client";

/**
 * סגנון 4: NEON / CYBERPUNK
 * - אפקטי זוהר
 * - צבעים חזקים על רקע כהה
 * - גריד לינארי
 * - אסתטיקה עתידנית
 */

import { motion } from "framer-motion";
import Link from "next/link";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "972502427616";
const wa = (text: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export function HomeNeon() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      
      {/* Grid Background */}
      <div 
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Glow Spots */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[150px]" />
      </div>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="text-center max-w-4xl">
          {/* Glitch Text Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="inline-block px-6 py-2 text-sm font-mono tracking-widest border border-cyan-400/50 text-cyan-400 bg-cyan-400/5">
              {'< DJ / PRODUCER />'}
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-6 relative"
          >
            <span className="relative">
              <span className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-500 blur-lg opacity-50" />
              <span className="relative bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                ALMOG
              </span>
            </span>
            <br />
            <span className="text-white">COHEN</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 font-mono mb-12 max-w-xl mx-auto"
          >
            {'// מוזיקה שמחזיקה קהל. בלי אוטומט.'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={wa("היי אלמוג!")}
              className="group relative px-8 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 font-bold text-black">EVENT_INQUIRY</span>
            </a>
            <Link
              href="/academy"
              className="group relative px-8 py-4 border-2 border-pink-500 overflow-hidden"
            >
              <span className="absolute inset-0 bg-pink-500 translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative z-10 font-bold text-pink-500 group-hover:text-black transition-colors">LEARN_DJ</span>
            </Link>
          </motion.div>
        </div>
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-y border-cyan-400/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: "500+", label: "EVENTS_COMPLETED", color: "cyan" },
            { num: "12", label: "YEARS_EXPERIENCE", color: "purple" },
            { num: "∞", label: "ENERGY_LEVEL", color: "pink" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 border border-gray-800 bg-gray-900/50 relative group hover:border-gray-700 transition-colors"
            >
              <div className={`absolute inset-0 bg-${stat.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`text-5xl md:text-7xl font-black font-mono text-${stat.color}-400 mb-2`}
                style={{ textShadow: `0 0 30px ${stat.color === 'cyan' ? '#22d3ee' : stat.color === 'purple' ? '#a855f7' : '#ec4899'}40` }}
              >
                {stat.num}
              </div>
              <div className="text-xs font-mono tracking-wider text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black font-mono mb-12 text-center"
          >
            <span className="text-cyan-400">{'>'}</span> SERVICES
          </motion.h2>
          
          <div className="space-y-4">
            {[
              { title: "events.wedding", desc: "חתונות בוטיק ואירועי יוקרה", href: "/weddings" },
              { title: "academy.courses", desc: "קורסי DJ מאפס למקצוענים", href: "/academy" },
              { title: "special.chogeg", desc: "חוגג מנגן - החתן על הבמה", href: "/chogeg-menagen" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center justify-between p-6 border border-gray-800 bg-gray-900/30 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all"
                >
                  <div>
                    <h3 className="text-xl font-mono text-cyan-400 group-hover:text-cyan-300">{item.title}</h3>
                    <p className="text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <span className="text-2xl text-gray-700 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all">→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-12 border border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-purple-500/5 relative"
        >
          <div className="absolute -inset-px bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-xl" />
          <h2 className="text-4xl md:text-5xl font-black font-mono mb-4 relative z-10">
            <span className="text-pink-400">CONNECT</span>_NOW
          </h2>
          <p className="text-gray-400 mb-8 relative z-10">{'// בואו ניצור משהו מיוחד יחד'}</p>
          <a
            href={wa("היי אלמוג!")}
            className="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-500 font-bold text-lg hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-shadow"
          >
            <span>INIT_CONTACT()</span>
          </a>
        </motion.div>
      </section>
    </div>
  );
}

export default HomeNeon;
