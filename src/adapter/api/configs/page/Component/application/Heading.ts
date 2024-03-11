import type { Title } from '../base/Title'
import type { Button } from '../base/Button'

export interface Heading {
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
