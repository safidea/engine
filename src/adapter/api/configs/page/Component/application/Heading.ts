import type { Title } from '../base/Title'
import type { Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Heading extends Base {
  title: Title
  buttons?: Button[]
}

export interface HeadingComponent extends Heading {
  component: 'Heading'
}

export interface HeadingBlock extends HeadingComponent {
  ref: string
}

export interface HeadingBlockRef extends Partial<Heading> {
  component: 'Heading'
  blockRef: string
}
