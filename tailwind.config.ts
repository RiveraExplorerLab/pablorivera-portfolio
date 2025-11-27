// tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        invert: {
          css: {
            '--tw-prose-body': theme('colors.stone[300]'),
            '--tw-prose-headings': theme('colors.stone[100]'),
            '--tw-prose-links': theme('colors.teal[400]'),
            '--tw-prose-bold': theme('colors.stone[100]'),
            '--tw-prose-counters': theme('colors.stone[400]'),
            '--tw-prose-bullets': theme('colors.teal[500]'),
            '--tw-prose-hr': theme('colors.slate[800]'),
            '--tw-prose-quotes': theme('colors.stone[100]'),
            '--tw-prose-code': theme('colors.teal[300]'),
            '--tw-prose-pre-bg': 'rgba(255, 255, 255, 0.05)',
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
