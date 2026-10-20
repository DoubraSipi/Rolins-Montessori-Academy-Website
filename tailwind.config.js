/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f8f5",
          100: "#e0efe7",
          200: "#c3dfce",
          300: "#98c7ab",
          400: "#67a982",
          500: "#458c62",
          600: "#34714e",
          700: "#2b5a40",
          800: "#254936",
          900: "#203d30"
        },
        gold: {
          100: "#fdf6e3",
          300: "#f6dfa0",
          500: "#e5b84f",
          700: "#b98f2c"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 3px rgba(16, 42, 30, 0.08), 0 8px 24px rgba(16, 42, 30, 0.06)"
      }
    }
  },
  plugins: []
};
