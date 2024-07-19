import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Component } from '..'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Components: React.FC<BaseProps>[]
  columns: number
}

interface Params {
  columns: number
  children: Component[]
  Component: ReactComponent<Props>
}

export class Grid implements Base<Props> {
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
