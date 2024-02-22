import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Props as LinkProps } from '../base/Link'
import type { Props as ButtonProps } from '../base/Button'

export interface Props extends BaseProps {
  title: string
  links?: LinkProps[]
  buttons?: ButtonProps[]
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Header implements Base<Props> {
  constructor(private params: Params) {}

  render = async () => {
    const { props: defaultProps, component: Component } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }
}
