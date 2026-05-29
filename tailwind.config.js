/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        ink: {
          DEFAULT: '#1a1410',
          muted: '#6b6259',
          subtle: '#a39b8f',
        },
        cream: {
          DEFAULT: '#f7f4ed',
          dark: '#2a2520',
          darker: '#322b25',
        },
        warm: {
          border: '#e5dfd3',
          line: '#ece7dc',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(26, 20, 16, 0.04), 0 4px 12px rgba(26, 20, 16, 0.06)',
        float: '0 8px 32px rgba(26, 20, 16, 0.08), 0 2px 8px rgba(26, 20, 16, 0.04)',
        panel: '0 12px 40px rgba(26, 20, 16, 0.1), 0 2px 8px rgba(26, 20, 16, 0.05)',
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
