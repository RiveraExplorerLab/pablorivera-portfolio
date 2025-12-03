// tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Type scale: 1.25 ratio (Major Third)
        'xs': ['0.75rem', { lineHeight: '1rem' }],           // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],       // 14px
        'base': ['1rem', { lineHeight: '1.625rem' }],        // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],       // 18px
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],       // 20px
        '2xl': ['1.563rem', { lineHeight: '2rem' }],         // 25px
        '3xl': ['1.953rem', { lineHeight: '2.375rem' }],     // 31px
        '4xl': ['2.441rem', { lineHeight: '2.75rem' }],      // 39px
        '5xl': ['3.052rem', { lineHeight: '3.25rem' }],      // 49px
        '6xl': ['3.815rem', { lineHeight: '1.1' }],          // 61px
      },
      typography: () => ({
        invert: {
          css: {
            '--tw-prose-body': '#e8e6f0',
            '--tw-prose-headings': '#e8e6f0',
            '--tw-prose-links': '#f0b429',
            '--tw-prose-bold': '#e8e6f0',
            '--tw-prose-counters': '#9d99a9',
            '--tw-prose-bullets': '#f0b429',
            '--tw-prose-hr': '#2a2633',
            '--tw-prose-quotes': '#e8e6f0',
            '--tw-prose-quote-borders': '#f0b429',
            '--tw-prose-code': '#fbbf24',
            '--tw-prose-pre-bg': '#1e1b26',
            '--tw-prose-pre-code': '#e8e6f0',
          },
        },
      }),
      animation: {
        'blob': 'blob 20s infinite',
        'blob-slow': 'blob 25s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(20px, -30px) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '75%': { transform: 'translate(30px, 10px) scale(1.05)' },
        },
      },
      backdropBlur: {
        '3xl': '64px',
      },
    },
  },
  plugins: [typography],
} satisfies Config
