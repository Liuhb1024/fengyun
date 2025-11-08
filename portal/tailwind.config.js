/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        primary: '#d34758',
        accent: '#f5c16c',
        deep: '#0e0f19',
      },
    },
  },
  plugins: [],
};
