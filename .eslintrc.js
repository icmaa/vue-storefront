module.exports = {
  root: true,
  env: { browser: true, jest: true },
  globals: { fetchMock: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 8,
    sourceType: 'module'
  },
  extends: [
    'plugin:vue/recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended'
  ],
  plugins: ['vue', 'vue-storefront', '@typescript-eslint'],
  rules: {
    'semi': 'off',
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/semi': 0,
    '@typescript-eslint/member-delimiter-style': ['error', { 'multiline': { 'delimiter': 'comma', 'requireLast': false }, 'singleline': { 'delimiter': 'comma' } }],
    '@typescript-eslint/no-empty-interface': 1,
    '@typescript-eslint/no-use-before-define': 1,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/class-name-casing': 1,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'handle-callback-err': 1,
    'prefer-promise-reject-errors': 0,
    'import/no-duplicates': 1,
    'arrow-parens': 0,
    'prefer-arrow-callback': 1,
    'generator-star-spacing': 0,
    'vue/no-unused-components': 1,
    'vue/no-v-html': 0,
    'vue/no-template-shadow': 2,
    'vue/max-attributes-per-line': 2,
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-options-name-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 0,
    'vue-storefront/no-corecomponent-import': 'error',
    'vue-storefront/no-corecomponent': 'error',
    'vue-storefront/no-corepage-import': 'error',
    'vue-storefront/no-corepage': 'error',
    'tailwindcss/no-custom-classname': [0],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-restricted-imports': [2, { paths: ['lodash-es'] }]
  },
  overrides: [
    {
      // @todo check if this is closed https://github.com/typescript-eslint/typescript-eslint/issues/342
      // This is an issue with interfaces so we need to wait until it fixed.
      files: ['core/**/*.ts'],
      rules: {
        'no-undef': 1
      }
    }
  ],
  settings: {
    tailwindcss: {
      config: "src/themes/icmaa-imp/tailwind.js"
    }
  }
};
