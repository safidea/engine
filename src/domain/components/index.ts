import { Paragraph, type ParagraphProps, type IParagraph } from './Paragraph'

export type IComponent = IParagraph

export type Components = {
  Paragraph: (props: ParagraphProps) => JSX.Element
}

export const components: Components = {
  Paragraph,
}
