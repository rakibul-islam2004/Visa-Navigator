/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-bg": "#1a202c",
        "light-bg": "#f9fafb",
      },
    },
  },
  plugins: [],
};
