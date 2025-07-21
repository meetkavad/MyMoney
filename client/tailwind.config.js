/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        error: "#F44336",
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5", // Used for background
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD", // Used for muted text
          500: "#9E9E9E", // Used for text
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121", // Used for primary text
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
