import type { ReactComponent, Base } from '../base'

export interface Props {
  title: string
  description: string
  copyright: string
  links: {
    label: string
    href: string
  }[]
}

export interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Footer implements Base {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
