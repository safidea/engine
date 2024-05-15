import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Cta extends Base {
  title: Title
  paragraph: Paragraph
  buttons: Button[]
}

export interface CtaComponent extends Cta {
  component: 'CTA'
}

export interface CtaBlock extends CtaComponent {
  ref: string
}

export interface CtaBlockRef extends Partial<Cta> {
  component: 'CTA'
  blockRef: string
}
