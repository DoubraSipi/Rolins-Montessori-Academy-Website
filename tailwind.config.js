/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Navy / indigo — matched to the school crest outline
        brand: {
          50: "#eef1fa",
          100: "#dde2f5",
          200: "#bcc7ec",
          300: "#8fa1e0",
          400: "#5f75cf",
          500: "#3c51b8",
          600: "#2b3b9c",
          700: "#22307d",
          800: "#1b2763",
          900: "#141c46",
          950: "#0c1130"
        },
        // Sky blue — the globe in the crest
        sky: {
          50: "#eff9fe",
          100: "#d9f0fb",
          200: "#b0e1f7",
          300: "#7ecdf1",
          400: "#4fb3e8",
          500: "#2f97d4",
          600: "#1f7ab4",
          700: "#1c6292",
          800: "#1d5278",
          900: "#1d4565"
        },
        // Gold — the motto banner
        gold: {
          50: "#fdfaef",
          100: "#fbf1d5",
          200: "#f6e0a4",
          300: "#f0cb6b",
          400: "#e9b943",
          500: "#dfa128",
          600: "#c67f1b",
          700: "#a45f17",
          800: "#874a1a",
          900: "#723e1b"
        },
        // Crimson — the arch wordmark
        crimson: {
          500: "#c0272d",
          600: "#a81f25",
          700: "#8c181d"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 3px rgba(20, 28, 70, 0.08), 0 8px 24px rgba(20, 28, 70, 0.06)"
      }
    }
  },
  plugins: []
};
