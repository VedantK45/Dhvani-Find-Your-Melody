/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5E807F',
        secondary: '#F4F1E9',
        accent: '#E8CAA4',
        mint: '#A7C5BD',
      },
      fontFamily: {
        heading: ['Quicksand', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        mood: ['Dancing Script', 'cursive'],
      },
      animation: {
        'pulse-wave': 'pulse-wave 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shuffle': 'shuffle 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-wave': {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shuffle': {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
    },
  },
  plugins: [],
};