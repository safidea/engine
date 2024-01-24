import { Hero, type HeroProps, type IHero } from './Hero'
import { Paragraph, type ParagraphProps, type IParagraph } from './Paragraph'

export type IComponent = IParagraph | IHero

export type Components = {
  Paragraph: (props: ParagraphProps) => JSX.Element
  Hero: (props: HeroProps) => JSX.Element
}

export const components: Components = {
  Paragraph,
  Hero,
}
