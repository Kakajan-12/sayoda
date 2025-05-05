/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBlue: "#245483",
        mainLight: "#CBC6A9",
        mainBlueGray: "#748B95",
        mainSkyBlue: "#87AEBF",
        mainNormBlue: "#84A4BC",
        mainForBackground: " #E3ECF5",
        activeColor: "BF8B30"
      },
      backgroundColor: {
        mainBlue: "#245483",
        mainLight: "#CBC6A9",
        mainBlueGray: "#748B95",
        mainSkyBlue: "#87AEBF",
        mainNormBlue: "#84A4BC",
      },
      top: {
        "90p": "90%",
      },
      screens: {
        bas: "500px",
        dort: "400px",
      },
      fontSize: {
        md: "16px",
      },
      fontFamily: {
        comforta: ["var(--font-comforta)", "sans-serif"],
        poppins: ["var(--font-poppins)", "latin"],
        quicksand: ["var(--font-quicksand)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
