import type React from 'react'
import type { Base, ReactComponent, BaseProps } from '../base/base'
import type { Props as LinkProps } from '../base/Link'
import type { Component } from '..'

export interface Props extends BaseProps {
  title?: string
  links: LinkProps[]
  children: React.ReactNode
}

interface Params {
  props: Omit<Props, 'children'> & { children: Component[] }
  component: ReactComponent<Props>
}

export class Sidebar implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { props: defaultProps, component: Component } = this.params
    const children = await Promise.all(defaultProps.children.map((child) => child.render()))
    return (props?: Partial<Props>) => (
      <Component
        {...{
          ...defaultProps,
          ...props,
          children: children.map((Child, index) => <Child key={index} />),
        }}
      />
    )
  }

  validateConfig = () => {
    return []
  }
}
