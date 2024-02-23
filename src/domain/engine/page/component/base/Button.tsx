import type { ReactComponent, Base, BaseProps } from './base'

export interface Props extends BaseProps {
  label: string
  href?: string
  variant?: 'primary' | 'secondary'
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Button implements Base<Props> {
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
