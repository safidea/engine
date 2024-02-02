import type { HeroProps } from '@domain/entities/Component/marketing/Hero'

export interface HeroDto extends HeroProps {
  component: 'Hero'
}
