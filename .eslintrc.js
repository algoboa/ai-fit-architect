module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React rules
    'react/prop-types': 'off', // Using TypeScript types instead
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/display-name': 'off',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'prefer-const': 'warn',
    'no-var': 'error',

    // Style rules (handled by Prettier)
    'semi': 'off',
    'quotes': 'off',
    'indent': 'off',
    'comma-dangle': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
  ],
};
