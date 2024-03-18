import type { ReactComponents } from '@infrastructure/engine'

export const components: Partial<ReactComponents> = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
}
