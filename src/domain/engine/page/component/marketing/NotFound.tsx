import type { Base, ReactComponent } from '../base'

export interface Props {
  title: string
  description: string
  primaryButton: {
    label: string
    href: string
  }
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class NotFound implements Base<Props> {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
