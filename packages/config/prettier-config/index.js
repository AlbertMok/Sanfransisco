module.exports = {
  ...require('prettier-config'),
  semi: false,
  tailwindConfig: 'packages/config/tailwind-config/tailwind.config.js',
  singleQuote: true,
  printWidth: 100,
  proseWrap: 'never',
  arrowParens: 'avoid',
  plugins: [require('prettier-plugin-tailwindcss')],
  trailingComma: 'es6',
  tabWidth: 4,
  semi: true,
}
