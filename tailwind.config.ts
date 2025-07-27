import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontSize: {
        'title-2xl': [
          '40px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'title-xl': [
          '30px',
          {
            lineHeight: '100%',
            fontWeight: '600',
          },
        ],
        'title-lb': [
          '20px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'title-lm': [
          '19px',
          {
            lineHeight: '150%',
            fontWeight: '700',
          },
        ],
        'title-mb': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '600',
          },
        ],
        'title-mm': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'title-sb': [
          '12px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'body-lm': [
          '24px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'body-mm': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'body-sm': [
          '12px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'label-xlm': [
          '20px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'label-lmb': [
          '18px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'label-lm': [
          '16px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'label-mb': [
          '16px',
          {
            lineHeight: '130%',
            fontWeight: '400',
          },
        ],
        'label-mm': [
          '12px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'label-sb': [
          '10px',
          {
            lineHeight: '140%',
            fontWeight: '700',
          },
        ],
        'label-sm': [
          '10px',
          {
            lineHeight: '140%',
            fontWeight: '500',
          },
        ],
        'caption-lm': [
          '16px',
          {
            lineHeight: '150%',
            fontWeight: '500',
          },
        ],
        'caption-mm': [
          '12px',
          {
            lineHeight: '150%',
            fontWeight: '500',
          },
        ],
        'caption-sm': [
          '10px',
          {
            lineHeight: '150%',
            fontWeight: '500',
          },
        ],
      },
      boxShadow: {
        'inset-lg': 'inset 0px 4px 35px 0px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
    screens: {
      sm: '320px', // Mobile
      md: '722px', // Tablet
      lg: '1025px', // Desktop
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
