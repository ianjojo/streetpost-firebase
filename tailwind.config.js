/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["CabinetGrotesk-Variable", "sans-serif"],
      chillax: ["Chillax-Variable", "sans-serif"],
      clash: ["ClashGrotesk-Variable", "sans-serif"],
    },
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "background-color": "var(--background)",

        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "accent-color": "var(--accent)",
        "shadow-color": "var(--shadow-color)",
      },
    },
  },
  plugins: [require("daisyui")],
};
