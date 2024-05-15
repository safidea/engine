import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Button } from '../base/Button'
import type { Base } from '../base/Base'

export interface Hero extends Base {
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
