/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          350: '#cbd5e1',
          450: '#94a3b8',
          850: '#1e293b',
          950: '#020617',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
