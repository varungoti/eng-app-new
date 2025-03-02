/** @type {import('tailwindcss').Config} */
import animatePlugin from 'tailwindcss-animate';
import typographyPlugin from '@tailwindcss/typography';

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'shimmer': {
          '100%': {
            'transform': 'translateX(100%)',
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      animationDelay: {
        ...Array.from({ length: 20 }, (_, i) => i * 50).reduce((acc, delay) => ({
          ...acc,
          [delay]: `${delay}ms`,
        }), {}),
      },
    },
  },
  plugins: [
    animatePlugin,
    typographyPlugin,
    function ({ addUtilities, theme }) {
      const animationDelays = theme('animationDelay', {});
      const utilities = Object.entries(animationDelays).reduce((acc, [key, value]) => ({
        ...acc,
        [`.animation-delay-${key}`]: { animationDelay: value },
      }), {});
      addUtilities(utilities);
    },
  ],
};

export default config;
