import type { BaseComponent, Base } from '../base'

export interface HeroProps {
  title: string
  description: string
  primaryButton: {
    label: string
    href: string
  }
}

export type HeroConfig = HeroProps

export interface HeroParams {
  component: BaseComponent<HeroProps>
}

export class Hero implements Base {
  constructor(
    private config: HeroProps,
    private params: HeroParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
