import type { ReactComponent, Base, BaseProps } from './base'
import type { State } from '../../State'
import type { Link, Props as LinkProps } from '../content/Link'
import type { ConfigError } from '@domain/entities/error/Config'

export interface Props extends BaseProps {
  label: string
  Links: React.FC<Partial<LinkProps>>[]
}

interface Params extends Omit<Props, 'Links'> {
  links: Link[]
  Component: ReactComponent<Props>
}

export class Dropdown implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { links } = this.params
    await Promise.all(links.map((link) => link.init()))
  }

  render = async (state: State) => {
    const { Component, links, ...defaultProps } = this.params
    const Links = await Promise.all(links.map((link) => link.render(state)))
    return (props?: Partial<Props>) => <Component {...{ Links, ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    const { links } = this.params
    const errors: ConfigError[] = []
    links.forEach((link) => {
      errors.push(...link.validateConfig())
    })
    return errors
  }
}
