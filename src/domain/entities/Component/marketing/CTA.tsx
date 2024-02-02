import type { ReactComponent, Base } from '../base'

export interface CtaProps {
  title: string
  description: string
  primaryButton: {
    label: string
    href: string
  }
}

export type CtaConfig = CtaProps

export interface CtaParams {
  component: ReactComponent<CtaProps>
}

export class Cta implements Base {
  constructor(
    private config: CtaConfig,
    private params: CtaParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
