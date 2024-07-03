import type { Base } from './Base'
import type { Config as Image } from '../content/Image'
import type { Config as Title } from '../content/Title'
import type { Config as Paragraph } from '../content/Paragraph'

export interface Config extends Base {
  image?: Image
  title: Title
  paragraph: Paragraph
  href?: string
}

export interface Card extends Config {
  component: 'Card'
}
