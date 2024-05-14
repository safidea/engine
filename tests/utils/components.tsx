import type { ReactComponents, CustomizedComponents, CustomizedProps } from '@safidea/engine'

export const overwritten: Partial<ReactComponents> = {
  Paragraph: ({ text }) => <p>Hello {text}</p>,
}

export const customized: CustomizedComponents = {
  MyComponent: () => <p>Customized component</p>,
  MyComponentWithProps: (props: CustomizedProps) => <p>Customized {props.text}</p>,
}
