import type { Config as Title } from '../base/Title'
import type { Config as Paragraph } from '../base/Paragraph'
import type { Config as Image } from '../base/Image'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title?: Title
  paragraph?: Paragraph
  images: Image[]
}

export interface Logos extends Config {
  component: 'Logos'
}
