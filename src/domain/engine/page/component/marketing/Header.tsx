import type { ReactComponent, Base } from '../base/base'
import type { Props as LinkProps } from '../base/Link'
import type { Props as ButtonProps } from '../base/Button'

export interface Props {
  title: string
  links: LinkProps[]
  buttons: ButtonProps[]
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Header implements Base<Props> {
  constructor(private params: Params) {}

  render = () => <this.params.component {...this.params.props} />
}
