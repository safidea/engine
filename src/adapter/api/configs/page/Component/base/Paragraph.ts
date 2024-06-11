import type { Align, Size } from '@domain/engine/page/component/base/base'
import type { Base } from './Base'

export interface Paragraph extends Base {
  text: string
  align?: Align
  size?: Size
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
