import type { ReactComponent, Base, BaseProps, Align, Size, Font } from '../base/base'

export interface Props extends BaseProps {
  text?: string
  children?: React.ReactNode
  align?: Align
  size?: Size
  font?: Font
}

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Paragraph implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {}

  render = async () => {
    const { Component, ...defaultProps } = this._params
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
