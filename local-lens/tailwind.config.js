/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delay-1': 'float-delay-1 3.5s ease-in-out infinite 0.5s',
        'float-delay-2': 'float-delay-2 4.2s ease-in-out infinite 1s',
        'float-delay-3': 'float-delay-3 3.8s ease-in-out infinite 1.5s',
        'float-delay-4': 'float-delay-4 4.1s ease-in-out infinite 2s',
        'float-delay-5': 'float-delay-5 3.6s ease-in-out infinite 0.8s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-delay-1': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-delay-2': {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-delay-3': {
          '0%, 100%': { transform: 'translateY(-3px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-delay-4': {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-delay-5': {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
}