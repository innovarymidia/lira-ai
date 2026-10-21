import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A",
          hover: "#1E293B"
        },
        secondary: {
          DEFAULT: "#334155",
          hover: "#475569"
        },
        cta: {
          DEFAULT: "#0369A1",
          hover: "#0284C7"
        },
        background: "#F8FAFC",
        foreground: "#020617",
        compliance: {
          success: "#059669",
          "success-bg": "#ECFDF5",
          warning: "#D97706",
          "warning-bg": "#FFFBEB",
          danger: "#DC2626",
          "danger-bg": "#FEF2F2",
          ai: "#2563EB",
          "ai-bg": "#EFF6FF",
          muted: "#64748B",
          "muted-bg": "#F1F5F9"
        }
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"]
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.1)",
        xl: "0 20px 25px rgba(0,0,0,0.15)"
      }
    }
  },
  plugins: []
};

export default config;
