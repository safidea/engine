import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Image } from '../base/Image'
import type { Base } from '../base/Base'

export interface Logos extends Base {
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
