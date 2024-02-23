import type { ReactComponent, Base, BaseProps } from '../base/base'

export interface Props extends BaseProps {
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

export class Cta implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { props: defaultProps, component: Component } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
