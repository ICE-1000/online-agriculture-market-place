/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#EEF1EA',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#0B6E4F',
          dark: '#095A40',
          light: '#E3F1E9',
        },
        accent: {
          DEFAULT: '#F59E0B',
          bg: '#FBE7CE',
        },
        danger: {
          DEFAULT: '#DC2626',
          bg: '#FCE4E4',
        },
        ink: '#141B16',
        muted: '#71797A',
        line: '#E4E7E1',
      },
      borderRadius: {
        card: '16px',
        pill: '999px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 27, 22, 0.06), 0 1px 1px rgba(20, 27, 22, 0.04)',
        phone: '0 0 0 1px rgba(20,27,22,0.05), 0 24px 60px rgba(20,27,22,0.12)',
      },
      maxWidth: {
        app: '480px',
      },
    },
  },
  plugins: [],
};
