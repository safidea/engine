import type { Config as Icon } from '../base/Icon'
import type { Config as Title } from '../base/Title'
import type { Config as Paragraph } from '../base/Paragraph'
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
