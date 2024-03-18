import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Button } from '../base/Button'

export interface Cta {
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
