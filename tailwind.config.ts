import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontSize: {
        // Title
        'title-2xl': ['40px', { lineHeight: '140%', fontWeight: '600' }],
        'title-xl': ['24px', { lineHeight: '140%', fontWeight: '700' }],
        'title-lb': ['20px', { lineHeight: '140%', fontWeight: '700' }],
        'title-lm': ['20px', { lineHeight: '140%', fontWeight: '500' }],
        'title-mb': ['16px', { lineHeight: '140%', fontWeight: '600' }],
        'title-mm': ['16px', { lineHeight: '140%', fontWeight: '500' }],
        'title-sb': ['12px', { lineHeight: '140%', fontWeight: '500' }],

        // Body
        'body-lm': ['24px', { lineHeight: '140%', fontWeight: '500' }],
        'body-mm': ['16px', { lineHeight: '140%', fontWeight: '500' }],
        'body-sm': ['12px', { lineHeight: '140%', fontWeight: '500' }],

        // Label
        'label-xlm': ['20px', { lineHeight: '140%', fontWeight: '500' }],
        'label-lmb': ['18px', { lineHeight: '140%', fontWeight: '500' }],
        'label-lm': ['16px', { lineHeight: '140%', fontWeight: '500' }],
        'label-mb': ['12px', { lineHeight: '140%', fontWeight: '700' }],
        'label-mm': ['12px', { lineHeight: '140%', fontWeight: '500' }],
        'label-sb': ['10px', { lineHeight: '140%', fontWeight: '700' }],
        'label-sm': ['10px', { lineHeight: '140%', fontWeight: '500' }],

        // Caption
        'caption-lm': ['16px', { lineHeight: '150%', fontWeight: '500' }],
        'caption-mm': ['12px', { lineHeight: '150%', fontWeight: '500' }],
        'caption-sm': ['10px', { lineHeight: '150%', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
};
export default config;
