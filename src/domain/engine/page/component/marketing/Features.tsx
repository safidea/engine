import type { Icon } from '../Icon'
import type { ReactComponent, Base, BaseProps } from '../base/base'

export interface Props extends BaseProps {
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

  render = async () => {
    const { props: defaultProps, component: Component } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }
}
