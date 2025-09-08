/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx}"],
  theme: { 
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-1.5%)' },
          '50%': { transform: 'translateX(1.5%)' },
          '75%': { transform: 'translateX(-1%)' }
        }
      },
      animation: {
        shake: 'shake 250ms ease-in-out'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
}