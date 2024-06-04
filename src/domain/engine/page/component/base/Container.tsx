import type { ReactComponent, Base, BaseProps } from './base'
import type { Component } from '..'
import type { State } from '../../State'

export type TextAlign = 'left' | 'center' | 'right'

export interface Props extends BaseProps {
  textAlign?: TextAlign
  children: React.ReactNode
}

interface Params extends Omit<Props, 'children'> {
  children: Component[]
  Component: ReactComponent<Props>
}

export class Container implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { children } = this.params
    await Promise.all(children.map((child) => child.init()))
  }

  render = async (state: State) => {
    const { Component, ...defaultProps } = this.params
    const children = await Promise.all(this.params.children.map((child) => child.render(state)))
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
