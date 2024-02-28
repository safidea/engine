import type { ReactComponent, Base, BaseProps } from './base'

export interface Props extends BaseProps {
  text: string
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
