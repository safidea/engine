import type { ReactComponent, Base, BaseProps } from './base'
import type { State } from '@domain/entities/Page/State'

import type { Link, Props as LinkProps } from '../content/Link'
import type { ConfigError } from '@domain/entities/Error/Config'

export interface Props extends BaseProps {
  label: string
  Links: React.FC<Partial<LinkProps>>[]
}

interface Params extends Omit<Props, 'Links'> {
  links: Link[]
  Component: ReactComponent<Props>
}

export class Dropdown implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { links } = this._params
    await Promise.all(links.map((link) => link.init()))
  }

  render = async (state: State) => {
    const { Component, links, ...defaultProps } = this._params
    const Links = await Promise.all(links.map((link) => link.render(state)))
    return (props?: Partial<Props>) => <Component {...{ Links, ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    const { links } = this._params
    const errors: ConfigError[] = []
    links.forEach((link) => {
      errors.push(...link.validateConfig())
    })
    return errors
  }
}
