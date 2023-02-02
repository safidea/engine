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
  },
})

export default async function testComponentsUI(components: ComponentUI[]) {
  const errors: { component: string; messages: string[] }[] = []
  await Promise.all(
    components.map(async (component) => {
      const script = await getComponentScript(component)
      const [{ messages }] = await eslint.lintText(script)
      if (messages?.length > 0) {
        errors.push({
          component: component.name,
          messages: messages.map((m) => m.message),
        })
      }
    })
  )
  return errors
}
