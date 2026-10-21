/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        lovixa: {
          bg: '#FBF6F8',
          text: '#2B1822',
          'text-muted': '#6A5A63',
          plum: '#6B2D5C',
          'plum-hover': '#562349',
          blush: '#E8C4D4',
          'blush-border': '#F0DCE5',
          'blush-soft': '#F7EBF0',
          espresso: '#2B1822',
          'espresso-light': '#3D2633',
        },
        plum: {
          DEFAULT: '#6B2D5C',
          hover: '#562349',
          light: '#FBF6F8',
          tint: '#E8C4D4',
          50: '#FDFBFC',
          100: '#FBF6F8',
          200: '#F5E6EE',
          300: '#E8C4D4',
          400: '#B66297',
          500: '#6B2D5C',
          600: '#562349',
          700: '#431938',
          800: '#32122A',
          900: '#2B1822',
        },
        espresso: {
          DEFAULT: '#2B1822',
          light: '#3D2633',
          muted: '#6A5A63',
          soft: '#FBF6F8',
        },
        blush: {
          DEFAULT: '#E8C4D4',
          light: '#FBF6F8',
          border: '#F0DCE5',
          hover: '#DFC0CE',
          soft: '#F7EBF0',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['var(--font-heading)', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-heading)', 'Outfit', 'sans-serif'],
        editorial: ['var(--font-heading)', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
