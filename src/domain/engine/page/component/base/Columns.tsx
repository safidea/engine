import type { ReactComponent, Base, BaseProps } from './base'
import type { Component } from '..'
import type { State } from '../../State'

export interface Props extends BaseProps {
  Components: React.FC<BaseProps>[]
  columnsNumber: number
}

interface Params {
  children: Component[]
  Component: ReactComponent<Props>
}

export class Columns implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { children } = this.params
    await Promise.all(children.map((child) => child.init()))
  }

  render = async (state: State) => {
    const { Component, ...defaultProps } = this.params
    const components = await Promise.all(this.params.children.map((child) => child.render(state)))
    return (props?: Partial<Props>) => (
      <Component
        {...{
          ...defaultProps,
          columnsNumber: components.length,
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
