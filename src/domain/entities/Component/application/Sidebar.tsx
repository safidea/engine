import type { Base, ReactComponent, BaseProps } from '../base/base'
import type { Link } from '../content/Link'
import type { Component } from '..'
import type { Title } from '../content/Title'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Props as TitleProps } from '../content/Title'
import type { Props as LinkProps } from '../content/Link'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Title?: React.FC<Partial<TitleProps>>
  Links: React.FC<Partial<LinkProps>>[]
  children: React.ReactNode
}

interface Params extends BaseProps {
  title?: Title
  links: Link[]
  children: Component[]
  Component: ReactComponent<Props>
}

export class Sidebar implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { children, title, links } = this._params
    await Promise.all([
      ...children.map((child) => child.init()),
      ...links.map((link) => link.init()),
      title?.init(),
    ])
  }

  render = async (state: State) => {
    const { Component, id, className } = this._params
    const children = await Promise.all(this._params.children.map((child) => child.render(state)))
    const Links = await Promise.all(this._params.links.map((link) => link.render(state)))
    const Title = this._params.title ? await this._params.title.render() : undefined
    return (props?: Partial<Props>) => (
      <Component
        {...{
          id,
          className,
          Title,
          Links,
          children: children.map((Child, index) => <Child key={index} />),
          ...props,
        }}
      />
    )
  }

  validateConfig = () => {
    const { children, title, links } = this._params
    const errors: ConfigError[] = []
    if (title) {
      errors.push(...title.validateConfig())
    }
    children.forEach((child) => {
      errors.push(...child.validateConfig())
    })
    links.forEach((link) => {
      errors.push(...link.validateConfig())
    })
    return errors
  }
}
