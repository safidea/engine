import type { Icon } from '../Icon'
import type { ReactComponent, Base } from '../base'

export interface Props {
  title: string
  description: string
  features: {
    title: string
    description: string
    icon: Icon
  }[]
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Features implements Base<Props> {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
