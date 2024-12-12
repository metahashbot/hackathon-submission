import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '100',
          }
        },
        fadeOut: {
          '0%': {
            opacity: '100',
          },
          '100%': {
            opacity: '0',
          }
        },
        rotate: {
          '0%': {
            transform: 'rotateY(0deg)'
          },
          '50%': {
            transform: 'rotateY(360deg)'
          },
          '100%': {
            transform: 'rotateY(0deg)'
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in 300ms forwards',
        fadeOut: 'fadeOut 1s ease-out 4s forwards',
        rotate: 'rotate 5s linear infinite',
      }
    },
  },
  plugins: [Typography],
} satisfies Config;
