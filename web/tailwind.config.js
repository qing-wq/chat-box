/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(96, 92, 229)',
          light: 'rgba(96, 92, 229, 0.1)',
          dark: 'rgb(76, 73, 182)',
        },
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          border: '#333333',
          text: '#F5F5F5',
        },
        light: {
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          border: '#E5E7EB',
          text: '#1F2937',
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
