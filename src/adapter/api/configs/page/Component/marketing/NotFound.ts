import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface NotFound extends Base {
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
