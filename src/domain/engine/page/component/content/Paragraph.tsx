import type { ReactComponent, Base, BaseProps, Align, Size } from '../base/base'

export interface Props extends BaseProps {
  text?: string
  children?: React.ReactNode
  align?: Align
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
