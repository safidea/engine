import type { ReactComponent, Base, BaseProps, Align, Size, SizeWithNone } from '../base/base'
import type { Component } from '..'
import type { State } from '../../State'

export interface Props extends BaseProps {
  align?: Align
  children: React.ReactNode
  width?: Size
  spacing?: SizeWithNone
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
