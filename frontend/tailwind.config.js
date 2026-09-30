/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A55",
          dark: "#16213E",
        },
        slate: {
          accent: "#5B7C99",
        },
        brand: {
          50: "#EEF5FF",
          100: "#DCEAFF",
          200: "#B3D3FF",
          300: "#7FB3FF",
          400: "#3D85FF",
          500: "#0B63F6",
          600: "#0850C9",
          700: "#073E9C",
          800: "#0A2F70",
          900: "#0B1524",
        },
        teal: {
          50: "#EAFBF6",
          100: "#CCF5E9",
          300: "#5FDCC0",
          400: "#2CC7A8",
          500: "#12B8A6",
          600: "#0C8C7E",
          700: "#0A6F65",
        },
        ink: "#0B1524",
        body: "#4A5A72",
        mist: "#F5F9FC",
        alert: {
          500: "#E23E45",
          600: "#C22A32",
        },
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11, 21, 36, 0.04), 0 8px 24px -8px rgba(11, 21, 36, 0.10)",
        card: "0 1px 2px rgba(11, 21, 36, 0.04), 0 16px 40px -16px rgba(11, 99, 246, 0.18)",
        glow: "0 0 0 6px rgba(18, 184, 166, 0.10)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 60% at 50% 0%, rgba(11,99,246,0.10) 0%, rgba(11,99,246,0) 70%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-line": {
          "0%": { strokeDashoffset: 400 },
          "100%": { strokeDashoffset: 0 },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
