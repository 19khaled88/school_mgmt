import type {Config} from 'tailwindcss';

const config:Config= {
      content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // for Next.js 13+ App Router
  ],
  theme: {
    extend: {
      backgroundImage:{
        "gradient-radial":"radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      colors: {
        primary: "#1E40AF",
        secondary: "#F59E0B",
        sky:'#C3EBFA',
        skyLight:'#EDF9FD',
        purple:'#CFCEFF',
        purpleLight:'#F1F0FF',
        yellow:'#FAE27C',
        yellowLight:'#FEFCE8'
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      
    },
  },
  plugins: [],
}

export default config;
