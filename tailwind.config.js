/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warm cream / parchment tones used as the app canvas. The
        // earlier flat #fff felt clinical and made every card blend
        // into the page; these tones give the whole shell a "page in
        // a book" feeling that makes white cards pop.
        paper: {
          50: '#fdfcf8',
          100: '#faf7ef',
          200: '#f3eedf',
          300: '#e8dfc6',
        },
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
        // Layered card shadows — first line is a tight contact shadow
        // (anchors the card to the page), second is a soft ambient
        // shadow (gives it perceived weight). Hover variant lifts both.
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
        cardHover:
          '0 4px 8px rgba(15, 23, 42, 0.06), 0 12px 32px rgba(15, 23, 42, 0.10)',
        glow: '0 0 0 6px rgba(16, 185, 129, 0.10)',
        innerSoft: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      backgroundImage: {
        // Subtle islamic-geometric grain. Tiled at 120px, very low
        // opacity, so it reads as paper texture rather than pattern.
        'paper-grain':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23c8b97d' stroke-width='0.5' opacity='0.25'><path d='M60 0 L120 60 L60 120 L0 60 Z'/><path d='M60 20 L100 60 L60 100 L20 60 Z'/><circle cx='60' cy='60' r='18'/></g></svg>\")",
        'radial-warm':
          'radial-gradient(ellipse at top, rgba(253, 252, 248, 1) 0%, rgba(243, 238, 223, 0.6) 100%)',
      },
    },
  },
  plugins: [],
};
