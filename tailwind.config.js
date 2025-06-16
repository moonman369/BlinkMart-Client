/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-200": "#ffbf00",
        "primary-100": "#ffc929",
        "highlight-100": "#5bc249",
        "secondary-200": "#00b050",
        "secondry-100": "#0b1a78",
        "bg-primary-100": "#1f2937",
      },
      fontSize: {
        "2xs": "0.65rem",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    function ({ addBase, addUtilities }) {
      addBase({
        html: {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
        },
        "html::-webkit-scrollbar": {
          display: "none",
        },
        "*": {
          scrollbarWidth: "none",
        },
        "*::-webkit-scrollbar": {
          display: "none",
        },
      });

      addUtilities({
        ".scrollbar-show": {
          scrollbarWidth: "auto",
          "-ms-overflow-style": "auto",
          "&::-webkit-scrollbar": {
            display: "block",
          },
        },
      });
    },
  ],
};
