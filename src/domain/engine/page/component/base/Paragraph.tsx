import type { ReactComponent, Base, BaseProps } from './base'

export interface Props extends BaseProps {
  text: string
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Paragraph implements Base<Props> {
  constructor(private params: Params) {}

  render = async () => {
    const { props: defaultProps, component: Component } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }
}
