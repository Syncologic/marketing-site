/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': {
          DEFAULT: '#0064E0',
          hover: '#0143B5',
          pressed: '#004BB9',
          light: '#47A5FA',
        },
        'dark-charcoal': '#1C2B33',
        'slate-gray': '#5D6C7B',
        'soft-gray': '#F1F4F7',
        'warm-gray': '#F7F8FA',
        'baby-blue': '#E8F3FF',
        'near-black': '#1C1E21',
        'divider': '#DEE3E9',
        'cta-disabled': '#DEE3E9',
        'cta-disabled-text': '#8595A4',
        'success': '#007D1E',
        'success-bg': 'rgba(0,125,30,0.08)',
        'success-border': 'rgba(0,125,30,0.18)',
        'chrome-red': '#FF5F57',
        'chrome-yellow': '#FEBC2E',
        'chrome-green': '#28C840',
        'error': '#C80A28',
        'error-bg': 'rgba(200,10,40,0.08)',
        'warning': '#F7B928',
      },
      fontFamily: {
        sans: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['64px', { lineHeight: '1.16', fontWeight: '500' }],
        'display-2': ['48px', { lineHeight: '1.17', fontWeight: '500' }],
        'h1':        ['36px', { lineHeight: '1.28', fontWeight: '500' }],
        'h2':        ['28px', { lineHeight: '1.21', fontWeight: '300' }],
        'h3':        ['18px', { lineHeight: '1.44', fontWeight: '700' }],
        'body':      ['18px', { lineHeight: '1.44', fontWeight: '400' }],
        'compact':   ['16px', { lineHeight: '1.50', fontWeight: '500', letterSpacing: '-0.01em' }],
        'caption':   ['14px', { lineHeight: '1.43', fontWeight: '400', letterSpacing: '-0.01em' }],
        'small':     ['12px', { lineHeight: '1.33', fontWeight: '400' }],
      },
      borderRadius: {
        'input': '8px',
        'card': '20px',
        'feature': '24px',
        'pill': '100px',
      },
      spacing: {
        'section-sm': '48px',
        'section': '64px',
        'section-lg': '80px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.10)',
        'card-elevated': '0 12px 28px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)',
      },
      maxWidth: {
        container: '1440px',
      },
    },
  },
  plugins: [],
};
