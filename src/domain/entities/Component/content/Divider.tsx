import type { ReactComponent, Base, BaseProps } from '../base/base'

export type Props = BaseProps

interface Params extends Props {
  Component: ReactComponent<Props>
}

export class Divider implements Base<Props> {
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
