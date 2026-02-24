import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#c9a84c",
          "gold-light": "#e8c87a",
          rose: "#d4627a",
          green: "#03b28c",
          gray: "#1a1715",
          white: "#f5f0e8",
          /* Legacy aliases for backward compat */
          blue: "#c9a84c",
        },
        surface: "var(--bg-surface)",
        "surface-hover": "var(--bg-surface-hover)",
        elevated: "var(--bg-elevated)",
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        muted: "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
          rose: "var(--accent-rose)",
          danger: "var(--accent-danger)",
          gold: "var(--accent-gold)",
          green: "var(--accent-green)",
        },
      },
      borderColor: {
        glass: "var(--glass-border)",
        "glass-strong": "var(--glass-border-strong)",
      },
      backdropBlur: {
        glass: "var(--glass-blur)",
      },
      boxShadow: {
        glass: "var(--card-shadow)",
        "glass-glow": "var(--card-shadow-glow)",
        "gold-sm": "0 2px 12px rgba(201, 168, 76, 0.15)",
        "gold-md": "0 4px 24px rgba(201, 168, 76, 0.2)",
        "gold-lg": "0 8px 40px rgba(201, 168, 76, 0.25)",
      },
      fontFamily: {
        rubik: ["var(--font-rubik)", "Rubik", "sans-serif"],
        display: ["var(--font-heebo)", "Heebo", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        swipe: "28px",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
