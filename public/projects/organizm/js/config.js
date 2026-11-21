/* ============================================================
   ORGANIZM — конфігурація Tailwind (CDN)
   ============================================================ */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E31818',
          dark: '#050505',
          gray: '#121212',
          card: '#161616',
          muted: '#8A8A8A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oswald', 'sans-serif']
      },
      letterSpacing: {
        'widest-xl': '0.2em'
      }
    }
  }
};
