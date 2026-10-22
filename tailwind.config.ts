import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: "#f0f7f2",
          100: "#dbeef0",
          200: "#b7e4c7",
          300: "#95d5b2",
          400: "#74c69d",
          500: "#52b788",
          600: "#40916c",
          700: "#2d6a4f",
          800: "#1b4332",
          900: "#081c15",
        },
        harvest: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        earth: {
          50: "#fbf8f5",
          100: "#f5eee6",
          200: "#ebd9c8",
          300: "#dec1a5",
          400: "#cfa580",
          500: "#bf895e",
          600: "#a66f47",
          700: "#855437",
          800: "#643f2a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
