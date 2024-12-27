import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
    overrides: [
      {
        files: ['**/*.test.ts', '**/*.test.js', '**/test/**/*'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
        },
      },
    ],
  },
  {
    ignores: ['**/dist/**', 'node_modules'],
  }
)
