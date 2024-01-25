import { Page, type PageProps } from './Page'
import { Paragraph, type ParagraphProps, type IParagraph } from './Paragraph'
import { Hero, type HeroProps, type IHero } from './Hero'
import { Logos, type ILogos, type LogosProps } from './Logos'

export type IComponent = IParagraph | IHero | ILogos

export type Components = {
  Page: (props: PageProps) => JSX.Element
  Paragraph: (props: ParagraphProps) => JSX.Element
  Hero: (props: HeroProps) => JSX.Element
  Logos: (props: LogosProps) => JSX.Element
}

export const components: Components = {
  Page,
  Paragraph,
  Hero,
  Logos,
}
