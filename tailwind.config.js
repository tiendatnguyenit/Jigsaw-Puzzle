/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e3f2fd",
          100: "#bbdefb",
          500: "#2196f3",
          600: "#1976d2",
          700: "#1565c0",
        },
        success: {
          50: "#e8f5e8",
          100: "#c8e6c9",
          500: "#4caf50",
          600: "#43a047",
          700: "#388e3c",
        },
        warning: {
          50: "#fff3e0",
          100: "#ffe0b2",
          500: "#ff9800",
          600: "#f57c00",
          700: "#ef6c00",
        },
        error: {
          50: "#ffebee",
          100: "#ffcdd2",
          500: "#f44336",
          600: "#e53935",
          700: "#d32f2f",
        },
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounce 1s infinite",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
