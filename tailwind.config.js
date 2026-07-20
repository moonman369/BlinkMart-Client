/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Brand: amber/gold ("BLINK") ----
        brand: {
          50: "#fffbeb",
          100: "#fff3c4",
          200: "#ffe585",
          300: "#ffd54a",
          400: "#ffc929",
          500: "#ffbf00",
          600: "#e0a300",
          700: "#b87f00",
          800: "#8f6100",
          900: "#6b4800",
        },
        // ---- Accent: green ("MART" / primary actions) ----
        mint: {
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          300: "#6ce9a6",
          400: "#32d583",
          500: "#12b76a",
          600: "#00b050",
          700: "#027a48",
          800: "#05603a",
          900: "#054f31",
        },
        // ---- Dark surface ramp (deeper + less blue than gray-800) ----
        surface: {
          base: "#0d0f13", // page background
          raised: "#14171d", // cards, panels
          overlay: "#1b1f27", // modals, dropdowns, sheets
          hover: "#232833", // hover state on raised
          border: "#2a303c", // hairline borders
          divider: "#1f242e", // subtle dividers
        },
        // ---- Text ramp ----
        ink: {
          primary: "#f4f6f8",
          secondary: "#b4bcc8",
          muted: "#7d8697",
          faint: "#586172",
        },
        // ---- Legacy aliases (kept so existing files keep compiling) ----
        "primary-200": "#ffbf00",
        "primary-100": "#ffc929",
        "highlight-100": "#5bc249",
        "secondary-200": "#00b050",
        "secondry-100": "#0b1a78",
        "secondary-100": "#0b1a78",
        "bg-primary-100": "#1f2937",
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "0.9rem" }],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      borderRadius: {
        card: "0.875rem",
        sheet: "1.25rem",
      },
      boxShadow: {
        // Dark-theme elevation: shadow for depth + inset hairline for edge definition
        e1: "0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
        e2: "0 4px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
        e3: "0 12px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
        e4: "0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glow-mint": "0 0 0 1px rgba(0,176,80,0.35), 0 6px 20px rgba(0,176,80,0.22)",
        "glow-brand": "0 0 0 1px rgba(255,191,0,0.35), 0 6px 20px rgba(255,191,0,0.20)",
      },
      transitionTimingFunction: {
        // Standard easings: "out" for enters, "spring" for interactive feedback
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        in: "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      transitionDuration: {
        fast: "140ms",
        base: "220ms",
        slow: "360ms",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pop: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.04)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "fade-up": "fade-up 340ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 240ms cubic-bezier(0.16, 1, 0.3, 1) both",
        pop: "pop 260ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "slide-up": "slide-up 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    function ({ addBase, addUtilities }) {
      addBase({
        // Hide scrollbars on horizontal rails only (see .no-scrollbar), not globally —
        // desktop users rely on the page scrollbar for orientation.
        "*": {
          "-webkit-tap-highlight-color": "transparent",
        },
      });

      addUtilities({
        ".no-scrollbar": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
        ".scrollbar-show": {
          scrollbarWidth: "auto",
          "-ms-overflow-style": "auto",
          "&::-webkit-scrollbar": { display: "block" },
        },
        // Edge-fade for horizontal scroll rails
        ".mask-fade-x": {
          maskImage:
            "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
          "-webkit-mask-image":
            "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
        },
      });
    },
  ],
};
