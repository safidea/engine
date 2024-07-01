import type { Config as Title } from '../base/Title'
import type { Config as Paragraph } from '../base/Paragraph'
import type { Config as Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  paragraph: Paragraph
  button: Button
}

export interface NotFound extends Config {
  component: 'NotFound'
}
