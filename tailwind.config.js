/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#05110B',
          900: '#0A1C12', // Primary Dark Background
          800: '#0D1F16', // Cards & Surfaces (Dark)
          700: '#132B20', // Card hover / elevated
          600: '#183528',
        },
        emeraldGlow: {
          DEFAULT: '#19C37D', // Glow & Primary CTA
          hover: '#15a86a',
          light: '#E8F7F0',
        },
        limeAccent: {
          DEFAULT: '#A3E635', // Highlight Accent
          hover: '#8fd425',
        },
        sage: {
          light: '#F5FAF7', // Eco Sage light background
          border: '#DCEAE4', // Crisp sage border
          text: '#12352D', // High contrast dark text
          muted: '#A7C4BA', // Muted subtitles dark
          mutedLight: '#5A7E74', // Muted text light
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 8px 24px -4px rgba(25, 195, 125, 0.35)',
        glowLg: '0 12px 32px -4px rgba(25, 195, 125, 0.45)',
      }
    },
  },
  plugins: [],
}
