import type { ReactComponent, Base, BaseProps } from './base'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface Props extends BaseProps {
  text: string
  center?: boolean
  size?: Size
}

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Paragraph implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { Component, ...defaultProps } = this.params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
