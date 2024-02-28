import type { Icon } from '../base/Icon'
import type { Paragraph } from '../base/Paragraph'
import type { Title } from '../base/Title'

export interface Features {
  title: Title
  paragraph: Paragraph
  features: {
    title: Title
    paragraph: Paragraph
    icon: Icon
  }[]
}

export interface FeaturesComponent extends Features {
  component: 'Features'
}

export interface FeaturesBlock extends FeaturesComponent {
  ref: string
}

export interface FeaturesBlockRef extends Partial<Features> {
  component: 'Features'
  blockRef: string
}
