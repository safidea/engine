import type { ReactComponent, Base, BaseProps } from './base'

export interface Props extends BaseProps {
  src: string
  alt: string
}

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Image implements Base<Props> {
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
