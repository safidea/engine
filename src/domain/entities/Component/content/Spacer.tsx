import type { ReactComponent, Base, BaseProps, Size } from '../base/base'

export interface Props extends BaseProps {
  size?: Size
}

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Spacer implements Base<Props> {
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
