import type { ReactComponent, Base, BaseProps } from '../base/base'

export interface Props extends BaseProps {
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

export class Footer implements Base<Props> {
  constructor(private params: Params) {}

  render = async () => {
    const { props: defaultProps, component: Component } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }
}
