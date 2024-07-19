import type { Config as Title } from '../content/Title'
import type { Config as Paragraph } from '../content/Paragraph'
import type { Config as Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  paragraph: Paragraph
  buttons: Button[]
}

export interface Hero extends Config {
  component: 'Hero'
}
