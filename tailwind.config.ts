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
            '--tw-prose-links': theme('colors.emerald[400]'),
            '--tw-prose-bold': theme('colors.stone[100]'),
            '--tw-prose-counters': theme('colors.stone[400]'),
            '--tw-prose-bullets': theme('colors.stone[600]'),
            '--tw-prose-hr': theme('colors.stone[800]'),
            '--tw-prose-quotes': theme('colors.stone[100]'),
            '--tw-prose-code': theme('colors.stone[100]'),
            '--tw-prose-pre-bg': theme('colors.stone[900]'),
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config