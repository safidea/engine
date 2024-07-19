import type { Config as Title } from '../content/Title'
import type { Config as Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Config extends Base {
  title: Title
  buttons?: Button[]
}

export interface Heading extends Config {
  component: 'Heading'
}
