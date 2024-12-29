import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-space-grotesk)", ...fontFamily.sans],
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        shake: 'shake 0.3s ease-in-out',
        messageBounce: 'bounce 1s cubic-bezier(0.36, 0, 0.66, -0.56)',
        slideInLeft: 'slideInLeft 0.5s ease-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        shake: {
          '0%, 100%': { 
            transform: 'translate(-50%, -50%) scale(1)' 
          },
          '20%': { 
            transform: 'translate(-50%, -50%) translateX(-4px) rotate(-2deg) scale(0.98)' 
          },
          '40%': { 
            transform: 'translate(-50%, -50%) translateX(4px) rotate(2deg) scale(0.98)' 
          },
          '60%': { 
            transform: 'translate(-50%, -50%) translateX(-4px) rotate(-2deg) scale(0.98)' 
          },
          '80%': { 
            transform: 'translate(-50%, -50%) translateX(4px) rotate(2deg) scale(0.98)' 
          }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '15%': { transform: 'translateY(-20px)' },
          '30%': { transform: 'translateY(0)' },
          '45%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-5px)' },
          '90%': { transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { 
            transform: 'translateX(-100%)' 
          },
          '100%': { 
            transform: 'translateX(0)' 
          }
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
