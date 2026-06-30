tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0D0D0D',
          white: '#FFFFFF',
          cream: '#FFFBF8',
          blush: '#FFF0F3',
          rose: '#E91E8C',
          'rose-soft': '#F48FB1',
          coral: '#FF5252',
          mint: '#00B894',
          gold: '#C9A96E'
        },
        navy: { DEFAULT: '#0D0D0D', light: '#FAFAFA', card: '#FFFFFF', muted: '#F5F5F5' },
        gold: { DEFAULT: '#C9A96E', light: '#E2D4B0', dark: '#A68B4B' },
        'rose-gold': '#F48FB1',
        cream: '#1A1A1A'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(233,30,140,0.12)',
        'sephora': '0 2px 12px rgba(0,0,0,0.08)'
      }
    }
  }
};