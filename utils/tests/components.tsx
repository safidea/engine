import type { ReactComponents } from '@infrastructure/client/engine'

export const components: Partial<ReactComponents> = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
}
