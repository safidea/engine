import type { Config as Title } from '../base/Title'
import type { Config as Paragraph } from '../base/Paragraph'
import type { Config as Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  paragraph: Paragraph
  buttons: Button[]
}

export interface Cta extends Config {
  component: 'CTA'
}
