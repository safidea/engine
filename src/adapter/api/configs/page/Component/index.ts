import type { Button } from './Button'
import type { Form } from './application/Form'
import type { Paragraph } from './Paragraph'
import type { Cta } from './marketing/Cta'
import type { Features } from './marketing/Features'
import type { Hero } from './marketing/Hero'
import type { Footer } from './marketing/Footer'
import type { Logos } from './marketing/Logos'
import type { NotFound } from './marketing/NotFound'

export type Component =
  | Paragraph
  | Button
  | Form
  | Cta
  | Features
  | Hero
  | Footer
  | Logos
  | NotFound
