import type { ReactComponents } from '@safidea/engine'

export const components: Partial<ReactComponents> = {
  Paragraph: ({ text = '' }) => <p>Hello {text}</p>,
}
