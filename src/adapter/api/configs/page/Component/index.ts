import type { Button } from './base/Button'
import type { Form } from './application/Form'
import type { Paragraph } from './base/Paragraph'
import type { Cta } from './marketing/Cta'
import type { Features } from './marketing/Features'
import type { Hero } from './marketing/Hero'
import type { Footer } from './marketing/Footer'
import type { Logos } from './marketing/Logos'
import type { NotFound } from './marketing/NotFound'
import type { Link } from './base/Link'
import type { Header } from './marketing/Header'

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
  | Link
  | Header
