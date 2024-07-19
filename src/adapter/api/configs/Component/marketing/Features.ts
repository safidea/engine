import type { Config as Icon } from '../content/Icon'
import type { Config as Title } from '../content/Title'
import type { Config as Paragraph } from '../content/Paragraph'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  paragraph: Paragraph
  features: {
    title: Title
    paragraph: Paragraph
    icon: Icon
  }[]
}

export interface Features extends Config {
  component: 'Features'
}
