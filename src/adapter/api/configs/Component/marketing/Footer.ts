import type { Config as Title } from '../content/Title'
import type { Config as Paragraph } from '../content/Paragraph'
import type { Config as Link } from '../content/Link'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  paragraph: Paragraph
  links: Link[]
  copyright: string
}

export interface Footer extends Config {
  component: 'Footer'
}
