import type { ReactComponent, Base } from './base'

export interface Props {
  label: string
  href: string
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Link implements Base<Props> {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
