module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'turbo', 'prettier'],
  ignorePatterns: ['prisma/client'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/version': 'off',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowNew: true,
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
