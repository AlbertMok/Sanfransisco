module.exports = {
  extends: ['next/core-web-vitals', 'turbo',"eslint:recommended", "standard",  "plugin:@typescript-eslint/recommended", // 引入相关插件
  "prettier", // 禁用 ESLint 中与 Prettier 冲突的规则
  "prettier/@typescript-eslint" // 禁用插件中与 Prettier 冲突的规则
],

  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'prettier/prettier': ["error", {}, {
      usePrettierrc: true,
      fileInfoOptions: {}
    }], // 使用 eslint-plugin-prettier 插件来检查 Prettier 冲突
  },
}


