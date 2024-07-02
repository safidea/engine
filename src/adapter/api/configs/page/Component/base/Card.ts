import type { Base } from './Base'
import type { Config as Image } from './Image'
import type { Config as Title } from './Title'
import type { Config as Paragraph } from './Paragraph'

export interface Config extends Base {
  image?: Image
  title: Title
  paragraph: Paragraph
  href?: string
}

export interface Card extends Config {
  component: 'Card'
}
