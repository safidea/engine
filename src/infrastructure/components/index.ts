import { Page, type PageProps } from './base/Page'
import { Paragraph, type ParagraphProps, type IParagraph } from './base/Paragraph'
import { Hero, type HeroProps, type IHero } from './marketing/Hero'
import { Logos, type ILogos, type LogosProps } from './marketing/Logos'
import { Features, type FeaturesProps, type IFeatures } from './marketing/Features'
import { CTA, type CTAProps, type ICTA } from './marketing/CTA'
import { Button, type ButtonProps, type IButton } from './base/Button'
import { Footer, type FooterProps, type IFooter } from './marketing/Footer'
import { NotFound, type NotFoundProps, type INotFound } from './marketing/NotFound'
import { Form, type FormProps, type IForm } from './application/Form'

export type { Icon } from './utils'
export type IComponent =
  | IParagraph
  | IHero
  | ILogos
  | IFeatures
  | ICTA
  | IButton
  | IFooter
  | INotFound
  | IForm

export type Components = {
  Page: (props: PageProps) => JSX.Element
  Paragraph: (props: ParagraphProps) => JSX.Element
  Hero: (props: HeroProps) => JSX.Element
  Logos: (props: LogosProps) => JSX.Element
  Features: (props: FeaturesProps) => JSX.Element
  CTA: (props: CTAProps) => JSX.Element
  Button: (props: ButtonProps) => JSX.Element
  Footer: (props: FooterProps) => JSX.Element
  NotFound: (props: NotFoundProps) => JSX.Element
  Form: (props: FormProps) => JSX.Element
}

export const components: Components = {
  Page,
  Paragraph,
  Hero,
  Logos,
  Features,
  CTA,
  Button,
  Footer,
  NotFound,
  Form,
}
