import type { ReactComponent, Base, BaseProps, Size, RoundedSize, Align } from '../base/base'

export interface Props extends BaseProps {
  src: string
  alt: string
  size?: Size
  rounded?: RoundedSize
  align?: Align
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
