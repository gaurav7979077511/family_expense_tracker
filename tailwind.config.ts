import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        "mono-jet": ["JetBrains Mono", "monospace"],
      },
      colors: {
        gray: {
          950: "#0a0b0e",
          900: "#0f1117",
          800: "#1a1d27",
          700: "#252836",
          600: "#3d4155",
          500: "#6b7280",
          400: "#9ca3af",
          300: "#d1d5db",
          200: "#e5e7eb",
          100: "#f3f4f6",
        },
      },
      borderOpacity: {
        "06": "0.06",
        "08": "0.08",
      },
      backgroundOpacity: {
        "02": "0.02",
        "03": "0.03",
        "05": "0.05",
        "08": "0.08",
      },
    },
  },
  plugins: [],
};

export default config;
