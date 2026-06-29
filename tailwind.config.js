/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        black: {
          DEFAULT: "#0A0A0A",
          card: "#141414",
          hover: "#1A1A1A",
          border: "#222222",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#D4BA85",
          dark: "#A8873A",
        },
        income: "#4ADE80",
        expense: "#F87171",
        accessory: "#60A5FA"
      },
    },
  },
  plugins: [],
}