import type { Button, ButtonProps } from './Button'
import type { HtmlProps } from './Html'
import type { Paragraph, ParagraphProps } from './Paragraph'
import type { Form, FormProps } from './application/Form'
import type { ReactComponent } from './base'
import type { Cta, CtaProps } from './marketing/Cta'
import type { Features, FeaturesProps } from './marketing/Features'
import type { Footer, FooterProps } from './marketing/Footer'
import type { Hero, HeroProps } from './marketing/Hero'
import type { Logos, LogosProps } from './marketing/Logos'
import type { NotFound, NotFoundProps } from './marketing/NotFound'

export type Component =
  | Paragraph
  | Button
  | Cta
  | Features
  | Footer
  | Hero
  | Logos
  | NotFound
  | Form

export interface ReactComponents {
  Html: ReactComponent<HtmlProps>
  Paragraph: ReactComponent<ParagraphProps>
  Hero: ReactComponent<HeroProps>
  Logos: ReactComponent<LogosProps>
  Features: ReactComponent<FeaturesProps>
  Cta: ReactComponent<CtaProps>
  Button: ReactComponent<ButtonProps>
  Footer: ReactComponent<FooterProps>
  NotFound: ReactComponent<NotFoundProps>
  Form: ReactComponent<FormProps>
}
