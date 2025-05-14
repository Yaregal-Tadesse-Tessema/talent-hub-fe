module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/no-unescaped-entities': 'off',

    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': [
      'warn',
      { props: 'never', children: 'never' },
    ],

    //#region  //*=========== Unused Import ===========
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-vars': 'off',
    //#endregion  //*======== Unused Import ===========

    //#region  //*=========== Import Sort ===========
    'simple-import-sort/exports': 'off',
    'simple-import-sort/imports': 'off',
    '@next/next/no-img-element': 'off',
    //#endregion  //*======== Import Sort ===========
  },
  globals: {
    React: true,
    JSX: true,
  },
};
