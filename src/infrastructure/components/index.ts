import type { ReactComponents } from '@domain/engine/page/component'
import { Form } from './application/Form'
import { Button } from './base/Button'
import { Html } from './base/Html'
import { Paragraph } from './base/Paragraph'
import { Cta } from './marketing/Cta'
import { Features } from './marketing/Features'
import { Footer } from './marketing/Footer'
import { Hero } from './marketing/Hero'
import { Logos } from './marketing/Logos'
import { NotFound } from './marketing/NotFound'
import { Link } from './base/Link'

export const components: ReactComponents = {
  Html,
  Paragraph,
  Hero,
  Logos,
  Features,
  Cta,
  Button,
  Footer,
  NotFound,
  Form,
  Link,
}
