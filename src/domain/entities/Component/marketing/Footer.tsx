import type { ReactComponent, Base } from '../base'

export interface FooterProps {
  title: string
  description: string
  copyright: string
  links: {
    label: string
    href: string
  }[]
}

export type FooterConfig = FooterProps

export interface FooterParams {
  component: ReactComponent<FooterProps>
}

export class Footer implements Base {
  constructor(
    private config: FooterProps,
    private params: FooterParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
