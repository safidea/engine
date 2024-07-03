import type { Config as Title } from '../content/Title'
import type { Config as Paragraph } from '../content/Paragraph'
import type { Config as Image } from '../content/Image'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title?: Title
  paragraph?: Paragraph
  images: Image[]
}

export interface Logos extends Config {
  component: 'Logos'
}
