/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        secondary: {
          800: '#1E293B',
          900: '#0F172A',
        },
        accent: {
          500: '#10B981',
        },
        danger: {
          500: '#EF4444',
        },
      },
    },
  },
};