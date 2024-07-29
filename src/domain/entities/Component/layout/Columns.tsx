import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Component } from '..'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Components: React.FC<BaseProps>[]
  columns: number
}

interface Params {
  children: Component[]
  Component: ReactComponent<Props>
}

export class Columns implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { children } = this._params
    await Promise.all(children.map((child) => child.init()))
  }

  render = async (state: State) => {
    const { Component, ...defaultProps } = this._params
    const components = await Promise.all(this._params.children.map((child) => child.render(state)))
    return (props?: Partial<Props>) => (
      <Component
        {...{
          ...defaultProps,
          columns: components.length,
          Components: components,
          ...props,
        }}
      />
    )
  }

  validateConfig = () => {
    return []
  }
}
