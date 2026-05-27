/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        prompt: ["Prompt", "system-ui", "sans-serif"],
        pacifico: ["Pacifico", "cursive"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        sparkle: {
          "0%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
        },
        "float-shadow": {
          "0%, 100%": { transform: "scaleX(1)", opacity: "0.35" },
          "50%": { transform: "scaleX(0.78)", opacity: "0.22" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        heartbeat: "heartbeat 1.4s ease-in-out infinite",
        sparkle: "sparkle 2.5s ease-in-out infinite",
        "float-shadow": "float-shadow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
