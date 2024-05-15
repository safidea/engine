import type { Base } from './Base'
import type { Size } from '@domain/engine/page/component/base/Paragraph'

export interface Paragraph extends Base {
  text: string
  center?: boolean
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
