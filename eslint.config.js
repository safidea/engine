import typescriptEslint from '@typescript-eslint/eslint-plugin'
import storybook from 'eslint-plugin-storybook'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:storybook/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      storybook: storybook,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'storybook/no-uninstalled-addons': 'off',
      'storybook/hierarchy-separator': 'off',
      'storybook/prefer-pascal-case': 'off',
      'storybook/story-exports': 'off',
    },
  },
  {
    files: ['**/tests/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['**/dist/**'],
  },
]
