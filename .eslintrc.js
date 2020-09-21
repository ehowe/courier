module.exports = {
  env: {
    es6: true,
  },
  extends: [
    'react-app',
    'standard',
  ],
  globals: {
    before: true,
    cy: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['flowtype'],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'array-element-newline': 'off',
    'camelcase': ['error', { ignoreDestructuring: true, properties: 'never' }],
    'comma-dangle': ['error', 'always-multiline'],
    'default-case': 'off',
    'flowtype/require-valid-file-annotation': 0,
    'jsx-quotes': ['error', 'prefer-double'],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': 'off',
    'quote-props': 'off',
    'quotes': ['error', 'single'],
    'react-hooks/exhaustive-deps': 0,
    'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
  },
  settings: { react: { version: 'detect' } },
}