import { Page, type PageProps } from './Page'
import { Paragraph, type ParagraphProps, type IParagraph } from './Paragraph'
import { Hero, type HeroProps, type IHero } from './Hero'

export type IComponent = IParagraph | IHero

export type Components = {
  Page: (props: PageProps) => JSX.Element
  Paragraph: (props: ParagraphProps) => JSX.Element
  Hero: (props: HeroProps) => JSX.Element
}

export const components: Components = {
  Page,
  Paragraph,
  Hero,
}
