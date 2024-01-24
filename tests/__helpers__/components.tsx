import type { Components } from '@domain/components'

export const components: Components = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
  Hero: () => <h1>Hero</h1>,
}
