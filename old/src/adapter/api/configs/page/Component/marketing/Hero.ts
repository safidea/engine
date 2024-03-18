import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Button } from '../base/Button'

export interface Hero {
  title: Title
  paragraph: Paragraph
  buttons: Button[]
}

export interface HeroComponent extends Hero {
  component: 'Hero'
}

export interface HeroBlock extends HeroComponent {
  ref: string
}

export interface HeroBlockRef extends Partial<Hero> {
  component: 'Hero'
  blockRef: string
}
