/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50:  '#fdf8f0',
          100: '#f8edda',
          200: '#f0d9b0',
          300: '#e4bf7e',
          400: '#d4a054',
          500: '#c4843a',
          600: '#a96a2e',
          700: '#8b5228',
          800: '#714228',
          900: '#5c3623',
        },
        bark: {
          50:  '#f7f5f2',
          100: '#ede9e2',
          200: '#ddd5c6',
          300: '#c8bba4',
          400: '#b09d83',
          500: '#9c856a',
          600: '#8c745b',
          700: '#755f4c',
          800: '#614f41',
          900: '#504238',
        },
        cream: '#fdf6ec',
        sand:  '#e8d5b0',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
