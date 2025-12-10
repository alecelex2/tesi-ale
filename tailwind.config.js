/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        game: ['DM Sans', 'sans-serif'],
        scratch: ['Rock Salt', 'cursive'],
      },
      colors: {
        genz: {
          neon: '#D4FF00',
          purple: '#9D4EDD',
          black: '#0a0a0a',
          white: '#ffffff',
          gray: '#f3f3f3',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-hover': '2px 2px 0px 0px #000000',
      }
    }
  },
  plugins: [],
}
