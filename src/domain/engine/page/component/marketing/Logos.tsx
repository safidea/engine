import type { ReactComponent, Base, BaseProps } from '../base/base'

export interface Props extends BaseProps {
  title: string
  logos: {
    src: string
    alt: string
  }[]
}

interface Params {
  props: Props
  component: ReactComponent<Props>
}

export class Logos implements Base<Props> {
  constructor(private params: Params) {}

  render = async () => {
    const { props: defaultProps, component: Component } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }
}
