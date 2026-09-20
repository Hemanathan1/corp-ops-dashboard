/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EFEAD9",
        surface: "#FBF9F3",
        ink: "#1E2420",
        forest: "#3E5C4E",
        rust: "#B54A2F",
        amber: "#C98A3B",
        line: "#C9C2AC",
        night: "#161C18",
        "night-surface": "#20271F",
        "line-dark": "#3A423C",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};