import type { BaseComponent, Base } from '../base'

export interface CTAProps {
  title: string
  description: string
  primaryButton: {
    label: string
    href: string
  }
}

export type CTAConfig = CTAProps

export interface CTAParams {
  component: BaseComponent<CTAProps>
}

export class CTA implements Base {
  constructor(
    private config: CTAConfig,
    private params: CTAParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
