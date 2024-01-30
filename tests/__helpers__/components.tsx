import type { Components } from 'src_OLD/domain/components'

export const components: Partial<Components> = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
}
