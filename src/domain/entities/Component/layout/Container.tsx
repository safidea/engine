import type { ReactComponent, Base, BaseProps, Breakpoint, Padding } from '../base/base'
import type { Component } from '..'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  children: React.ReactNode
  center?: boolean
  breakpoint?: Breakpoint
  padding?: Padding
}

interface Params extends Omit<Props, 'children'> {
  children: Component[]
  Component: ReactComponent<Props>
}

export class Container implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { children } = this._params
    await Promise.all(children.map((child) => child.init()))
  }

  render = async (state: State) => {
    const { Component, ...defaultProps } = this._params
    const children = await Promise.all(this._params.children.map((child) => child.render(state)))
    return (props?: Partial<Props>) => (
      <Component
        {...{
          ...defaultProps,
          children: children.map((Child, index) => <Child key={index} />),
          ...props,
        }}
      />
    )
  }

  validateConfig = () => {
    return []
  }
}
