/**
 * ESLint configuration
 * http://eslint.org/docs/user-guide/configuring
 */
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'import',
    'promise',
  ],
  rules: {
    'no-console': 'off',
    'linebreak-style': 'off', // Avoid LF/CRLF on Win/Linux/Mac
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
  },
};
