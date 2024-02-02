import type { ButtonDto } from './ButtonDto'
import type { FormDto } from './application/FormDto'
import type { ParagraphDto } from './ParagraphDto'
import type { CtaDto } from './marketing/CtaDto'
import type { FeaturesDto } from './marketing/FeaturesDto'
import type { HeroDto } from './marketing/HeroDto'
import type { FooterDto } from './marketing/FooterDto'
import type { LogosDto } from './marketing/LogosDto'

export type ComponentDto =
  | ParagraphDto
  | ButtonDto
  | FormDto
  | CtaDto
  | FeaturesDto
  | HeroDto
  | FooterDto
  | LogosDto
