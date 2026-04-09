/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                  // Vite usually keeps this in the root
    "./public/**/*.html",            // Scans all folders inside public
    "./src/**/*.{js,ts,jsx,tsx,html}" // Scans your source code files
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#F9F8F6",
          text: "#0F172A",
          default: "#C9B59C",
          spark: "#D9CFC7",
          temn: "#EFE9E3",
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};