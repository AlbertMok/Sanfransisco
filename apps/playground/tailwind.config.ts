import defaultTheme from 'tailwindcss/defaultTheme'
import colors from './colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx}', './src/styles/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    // Override base screen sizes
    screens: {
      ...defaultTheme.screens,
      betterhover: { raw: '(hover: hover)' },
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0px 0.8px 2px rgba(0, 0, 0, 0.032), 0px 2.7px 6.7px rgba(0, 0, 0, 0.048), 0px 12px 30px rgba(0, 0, 0, 0.08)',
      'lg-dark':
        '0 0 0 1px rgba(255,255,255,.15), 0px 0.8px 2px rgba(0, 0, 0, 0.032), 0px 2.7px 6.7px rgba(0, 0, 0, 0.048), 0px 12px 30px rgba(0, 0, 0, 0.08)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.05)',
      none: 'none',
    },
    extend: {
      fontFamily: {
        sans: ['Optimistic Display', '-apple-system', ...defaultTheme.fontFamily.sans],
        mono: ['"Source Code Pro"', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        code: 'calc(1em - 20%)',
      },
      lineHeight: {
        base: '24px',
        large: '38px',
      },
      colors,
      gridTemplateColumns: {
        'only-content': 'auto',
        'sidebar-content': '20rem auto',
        'sidebar-content-toc': '20rem auto 20rem',
      },
    },
  },
}