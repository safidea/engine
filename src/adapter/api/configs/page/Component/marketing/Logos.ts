import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Image } from '../base/Image'

export interface Logos {
  title?: Title
  paragraph?: Paragraph
  images: Image[]
}

export interface LogosComponent extends Logos {
  component: 'Logos'
}

export interface LogosBlock extends LogosComponent {
  ref: string
}

export interface LogosBlockRef extends Partial<Logos> {
  component: 'Logos'
  blockRef: string
}
