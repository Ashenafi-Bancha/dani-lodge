/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F3A2B',
          deep: '#12231A',
          soft: '#2C4A38',
        },
        moss: '#5E7A5B',
        gold: {
          DEFAULT: '#C8A45A',
          light: '#E2C98C',
          // dark enough to pass AA as text on cream
          deep: '#8A6A2B',
        },
        cream: {
          DEFAULT: '#F6F1E6',
          light: '#FBF8F1',
          dark: '#ECE4D3',
        },
        ink: '#1A211C',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '"Noto Sans Ethiopic"', 'system-ui', 'sans-serif'],
        ethiopic: ['"Noto Sans Ethiopic"', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.22em',
      },
      transitionTimingFunction: {
        'smooth-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        soft: '0 20px 50px -20px rgba(18, 35, 26, 0.35)',
      },
    },
  },
  plugins: [],
};
