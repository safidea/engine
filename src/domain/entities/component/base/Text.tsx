import type { IComponentBase } from "../IComponent"

export interface IComponentParagraphProps {
  text: string
}

export interface IComponentParagraph extends IComponentBase {
  name: 'paragraph'
  template: ({ text }: IComponentParagraphProps) => JSX.Element
}

export const Text: IComponentParagraph = {
  name: 'paragraph',
  template: ({ text }) => <p>{text}</p>,
}
