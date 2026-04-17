/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        panel: '#111827',
      },
      boxShadow: {
        card: '0 8px 20px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

