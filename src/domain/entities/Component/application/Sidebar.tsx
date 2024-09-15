import type { Base, BaseProps, BaseServices } from '../base'
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

export type Config = BaseProps

export type Services = BaseServices

export interface Entities {
  title?: Title
  links: Link[]
  children: Component[]
}

export class Sidebar implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { children, title, links } = this._entities
    await Promise.all([
      ...children.map((child) => child.init()),
      ...links.map((link) => link.init()),
      title?.init(),
    ])
  }

  render = async (state: State) => {
    const { id, className } = this._config
    const children = await Promise.all(this._entities.children.map((child) => child.render(state)))
    const Links = await Promise.all(this._entities.links.map((link) => link.render(state)))
    const Title = this._entities.title ? await this._entities.title.render() : undefined
    const Component = this._services.client.components.Sidebar
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
    const { children, title, links } = this._entities
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
