import { ESLint } from 'eslint'
import getComponentScript from '../src/get-component-script'

import type { ComponentUI } from '../types/component.type'

const eslint = new ESLint({
  useEslintrc: false,
  overrideConfig: {
    plugins: ['react', '@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
})

export default async function testComponentsUI(components: ComponentUI[]): Promise<void> {
  const errors: { component: string; messages: string[] }[] = []
  await Promise.all(
    components.map(async (component) => {
      const script = await getComponentScript(
        component,
        components.map((c) => c.name)
      )
      const [{ messages }] = await eslint.lintText(script)
      if (messages?.length > 0) {
        errors.push({
          component: component.name,
          messages: messages.map((m) => m.message),
        })
      }
    })
  )
  if (errors.length > 0) {
    if (process.env.NODE_ENV !== 'test') console.error('Errors:', errors)
    throw new Error('Components UI are not valid')
  }
}
