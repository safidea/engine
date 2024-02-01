import type { Components } from 'src/infrastructure/components'

export const components: Partial<Components> = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
}
