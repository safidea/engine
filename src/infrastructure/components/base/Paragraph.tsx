export interface ParagraphProps {
  text: string
}

export interface IParagraph extends ParagraphProps {
  component: 'Paragraph'
}

export const Paragraph = ({ text }: ParagraphProps) => <p>{text}</p>
