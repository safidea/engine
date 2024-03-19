import type { ReactComponents } from '@domain/engine/page/component'

export const components: Partial<ReactComponents> = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
}
