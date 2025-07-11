/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/renderer/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      // Map your colors to CSS custom properties
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-accent)",
      background: "var(--color-background)",
      surface: "var(--color-surface)",
      text: "var(--color-text)",
    },
  },
  plugins: [],
};
