import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Button } from '../base/Button'

export interface NotFound {
  title: Title
  paragraph: Paragraph
  button: Button
}

export interface NotFoundComponent extends NotFound {
  component: 'NotFound'
}

export interface NotFoundBlock extends NotFoundComponent {
  ref: string
}

export interface NotFoundBlockRef extends Partial<NotFound> {
  component: 'NotFound'
  blockRef: string
}
