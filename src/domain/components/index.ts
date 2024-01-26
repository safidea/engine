import { Page, type PageProps } from './base/Page'
import { Paragraph, type ParagraphProps, type IParagraph } from './base/Paragraph'
import { Hero, type HeroProps, type IHero } from './marketing/Hero'
import { Logos, type ILogos, type LogosProps } from './marketing/Logos'
import { Features, type FeaturesProps, type IFeatures } from './marketing/Features'
import { type ICTA, type CTAProps, CTA } from './marketing/CTA'
import { Button, type ButtonProps, type IButton } from './base/Button'

export type { Icon } from './utils'
export type IComponent = IParagraph | IHero | ILogos | IFeatures | ICTA | IButton

export type Components = {
  Page: (props: PageProps) => JSX.Element
  Paragraph: (props: ParagraphProps) => JSX.Element
  Hero: (props: HeroProps) => JSX.Element
  Logos: (props: LogosProps) => JSX.Element
  Features: (props: FeaturesProps) => JSX.Element
  CTA: (props: CTAProps) => JSX.Element
  Button: (props: ButtonProps) => JSX.Element
}

export const components: Components = {
  Page,
  Paragraph,
  Hero,
  Logos,
  Features,
  CTA,
  Button,
}
