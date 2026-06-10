import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        border: "var(--color-border)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        primary: "var(--color-primary)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        ai: "var(--color-ai)"
      },
      boxShadow: {
        card: "0 12px 24px rgba(15, 23, 42, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
