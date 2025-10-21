/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          light: '#F2BBC9',
          DEFAULT: '#F2BBC9',
        },
        lavender: {
          light: '#AFA9D9',
          DEFAULT: '#AFA9D9',
        },
        slate: {
          blue: '#8082A6',
          DEFAULT: '#8082A6',
        },
        navy: {
          dark: '#282E40',
          DEFAULT: '#282E40',
        },
        peach: {
          light: '#F2A172',
          DEFAULT: '#F2A172',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

