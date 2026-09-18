import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Auros Design System Palette
        "liquid-abyss": "#012624",
        "liquid-deep": "#011d1c",
        "liquid-kelp": "#003734",
        "liquid-mist": "#edfffe",
        "platinum": "#ffffff",
        "silver-mist": "#bbc7c6",
        "ash": "#f2f2f2",
        "slate-deep": "#707777",
        "lavender-phosphor": "#fde9ff",
        // Integrated Biosciences Palette
        "bioluminescent-lime": "#cef79e",
        "abyssal-ink": "#222f30",
      },
      backgroundImage: {
        "bioluminescent-gradient": "linear-gradient(90deg, rgb(0, 130, 124) 0%, rgb(203, 255, 252) 100%)",
        "aurora-gradient": "linear-gradient(90deg, rgb(203, 255, 252) 0%, rgb(237, 255, 254) 26.25%, rgb(255, 253, 250) 47.57%, rgb(250, 209, 255) 88.96%)",
        "hero-overlay": "linear-gradient(180deg, rgba(34, 47, 48, 0.45) 0%, rgba(1, 38, 36, 0.85) 75%, #012624 100%)",
      },
      fontFamily: {
        aspekta: ["var(--font-aspekta)", "'Inter Tight'", "ui-sans-serif", "system-ui", "sans-serif"],
        matter: ["var(--font-matter)", "'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        arial: ["Arial", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        cards: "16px",
        buttons: "6px",
        small: "6px",
      },
      letterSpacing: {
        "tight-display": "-0.046em",
        "tight-h1": "-0.03em",
        "tight-h2": "-0.02em",
        "wide-label": "0.12em",
        "wide-caption": "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
