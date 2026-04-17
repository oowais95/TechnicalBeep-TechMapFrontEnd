/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        panel: '#111827',
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      boxShadow: {
        card: '0 8px 30px rgba(79, 70, 229, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
        glow: '0 0 40px rgba(139, 92, 246, 0.15)',
      },
      keyframes: {
        'featured-marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'featured-marquee': 'featured-marquee linear infinite',
      },
    },
  },
  plugins: [],
}

