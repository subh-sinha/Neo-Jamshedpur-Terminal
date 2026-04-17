/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081018",
        panel: "#0c1724",
        cyber: "#36f1ff",
        cobalt: "#4f8cff",
        ember: "#ffb547",
        danger: "#ff5263",
        mist: "#8aa5c2"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(54,241,255,0.15), 0 0 24px rgba(54,241,255,0.16)",
        danger: "0 0 0 1px rgba(255,82,99,0.22), 0 0 24px rgba(255,82,99,0.18)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at top, rgba(79,140,255,0.16), transparent 35%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
      },
      fontFamily: {
        sans: ["Segoe UI", "sans-serif"],
        mono: ["Consolas", "monospace"]
      }
    }
  },
  plugins: []
};
