import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 米黄系：旧纸张
        paper: {
          50: "#faf5e6",
          100: "#f5ecd7",
          200: "#ebe0c4",
          300: "#dccea4",
          400: "#c9b685",
          500: "#b59c6a",
        },
        // 深棕系：墨迹与边框
        ink: {
          50: "#e8e0d4",
          100: "#b8a890",
          200: "#80684a",
          300: "#5c4631",
          400: "#4a3322",
          500: "#3a2818",
          600: "#2a1c10",
          700: "#1a1208",
          800: "#100a04",
        },
        // 暗红：印章
        seal: {
          400: "#a04040",
          500: "#8b2c2c",
          600: "#7a2424",
          700: "#651c1c",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif-sc)", "Georgia", "serif"],
        hand: ["var(--font-ma-shan-zheng)", "var(--font-noto-serif-sc)", "serif"],
        zcool: ["var(--font-zcool)", "var(--font-noto-serif-sc)", "serif"],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(ellipse at 20% 30%, rgba(150,120,80,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(120,80,40,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(180,150,100,0.04) 0%, transparent 70%)",
      },
      animation: {
        "fade-up": "fadeUp 1.2s ease-out forwards",
        "slow-pulse": "slowPulse 4s ease-in-out infinite",
        "ink-spread": "inkSpread 2s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        inkSpread: {
          "0%": { opacity: "0", filter: "blur(8px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
