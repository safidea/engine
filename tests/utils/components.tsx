import type { ReactComponents } from '@domain/engine/page/component'

export const overwritten: Partial<ReactComponents> = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
}

export const customized: { [key: string]: React.FC } = {
  MyComponent: () => <p>Customized component</p>,
}
