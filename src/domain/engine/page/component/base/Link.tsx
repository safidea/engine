import type { ReactComponent, Base, BaseProps } from './base'

export interface Props extends BaseProps {
  label: string
  href: string
  beforeIcon?: string
  afterIcon?: string
  active?: boolean
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Link implements Base<Props> {
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
