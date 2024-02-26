import type { ReactComponent, Base, BaseProps } from './base'

export interface Props extends BaseProps {
  text: string
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  center?: boolean
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Title implements Base<Props> {
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
