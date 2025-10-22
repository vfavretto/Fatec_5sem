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
          DEFAULT: '#F2A922',
          light: '#F2A922',
        },
        secondary: {
          DEFAULT: '#F25D07',
          light: '#F25D07',
        },
        accent: {
          DEFAULT: '#A66E4E',
          light: '#A66E4E',
        },
        error: {
          DEFAULT: '#8C1D04',
          light: '#8C1D04',
        },
        dark: {
          DEFAULT: '#201B26',
          bg: '#201B26',
        },
        // Aliases para compatibilidade
        lavender: {
          DEFAULT: '#F2A922',
          light: '#F2A922',
        },
        peach: {
          DEFAULT: '#F25D07',
          light: '#F25D07',
        },
        slate: {
          blue: '#A66E4E',
          DEFAULT: '#A66E4E',
        },
        navy: {
          dark: '#201B26',
          DEFAULT: '#201B26',
        },
        rose: {
          DEFAULT: '#8C1D04',
          light: '#8C1D04',
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

