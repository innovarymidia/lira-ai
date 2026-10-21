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
        // Cores Institucionais Oficiais Lira AI
        forest: {
          DEFAULT: "#123F35",
          hover: "#0E322A",
          light: "#1C5C4E"
        },
        environmental: {
          DEFAULT: "#21845B",
          hover: "#1A6B4A",
          light: "#2CA371"
        },
        digital: {
          DEFAULT: "#65D6AD",
          hover: "#4EC79A",
          light: "#8AE2C2"
        },
        sprout: {
          DEFAULT: "#B8E0A5",
          hover: "#A3D48D",
          light: "#EDF8E7"
        },
        water: {
          DEFAULT: "#176B82",
          hover: "#125466",
          light: "#E2F0F4"
        },
        cerrado: {
          DEFAULT: "#D9A441",
          hover: "#BF8F35",
          light: "#FDF5E6"
        },
        earth: {
          DEFAULT: "#A65B3F",
          hover: "#8E4C33",
          light: "#FAF0EC"
        },
        // Mapeamentos de Compatibilidade e Semantica
        primary: {
          DEFAULT: "#123F35",
          hover: "#0E322A"
        },
        secondary: {
          DEFAULT: "#26352F",
          hover: "#1A2521"
        },
        cta: {
          DEFAULT: "#21845B",
          hover: "#1A6B4A"
        },
        background: "#F5F7F5",
        surface: "#FFFFFF",
        border: "#E3E9E4",
        foreground: "#26352F",
        muted: "#66736B",
        // Estados de Conformidade Ambiental
        compliance: {
          success: "#21845B",
          "success-bg": "#EBF6F1",
          warning: "#D9A441",
          "warning-bg": "#FDF5E6",
          danger: "#DC2626",
          "danger-bg": "#FEF2F2",
          ai: "#65D6AD",
          "ai-bg": "#EDFAF5",
          water: "#176B82",
          "water-bg": "#E2F0F4",
          earth: "#A65B3F",
          "earth-bg": "#FAF0EC",
          muted: "#66736B",
          "muted-bg": "#E3E9E4"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Plus Jakarta Sans", "sans-serif"]
      },
      boxShadow: {
        xs: "0 1px 2px rgba(18, 63, 53, 0.04)",
        sm: "0 1px 3px rgba(18, 63, 53, 0.06)",
        md: "0 4px 8px rgba(18, 63, 53, 0.08)",
        lg: "0 10px 18px rgba(18, 63, 53, 0.1)",
        xl: "0 20px 25px rgba(18, 63, 53, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

