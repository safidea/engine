export interface Paragraph {
  text: string
}

export interface ParagraphComponent extends Paragraph {
  component: 'Paragraph'
}

export interface ParagraphBlock extends ParagraphComponent {
  ref: string
}

export interface ParagraphBlockRef extends Partial<Paragraph> {
  component: 'Paragraph'
  blockRef: string
}
