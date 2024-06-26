import type { ReactComponent, Base, BaseProps, Align, Size } from './base'

export interface Props extends BaseProps {
  text: string
  size?: Size
  align?: Align
}

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Title implements Base<Props> {
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
