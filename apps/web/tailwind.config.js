/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        muyu: {
          primary: '#1a3a2a',
          secondary: '#2d6a4f',
          accent: '#52b788',
          light: '#d8f3dc',
          dark: '#081c15',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
