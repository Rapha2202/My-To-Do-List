/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#f3f3f3",
          DEFAULT: "#f3f3f3",
          dark: "#0f0f0f",
        },
        secondary: {
          light: "#202121",
          DEFAULT: "#202121",
          dark: "#f4f7f6",
        },
      },
    },
    fontFamily: {
      apercu: ["Apercu Mono Pro", "sans-serif"],
    },
  },
  plugins: [],
};
