/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: "#0B1E3D",
        "navy-light": "#13315C",
        teal: "#0F766E",
        "teal-dark": "#0B5A54",
        coral: "#F4694A",
        gold: "#D4A72C",
        surface: "#F7F9FA",
        muted: "#6B7280",
      },
      fontFamily: {
        heading: ["SpaceGrotesk-Bold"],
        body: ["Inter-Regular"],
        mono: ["IBMPlexMono-Regular"],
      },
    },
  },
  plugins: [],
};
