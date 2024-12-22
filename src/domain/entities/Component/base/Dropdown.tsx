import type { Base, BaseProps, BaseServices } from '../base'
import type { PageState } from '@domain/entities/Page/State'

import type { Link, Props as LinkProps } from '../content/Link'
import type { ConfigError } from '@domain/entities/Error/Config'

export interface Props extends BaseProps {
  label: string
  Links: React.FC<Partial<LinkProps>>[]
}

export interface Config extends BaseProps {
  label: string
}

export type Services = BaseServices

export interface Entities {
  links: Link[]
}

export class Dropdown implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { links } = this._entities
    await Promise.all(links.map((link) => link.init()))
  }

  render = async (state: PageState) => {
    const { ...defaultProps } = this._config
    const { links } = this._entities
    const Component = this._services.client.components.Dropdown
    const Links = await Promise.all(links.map((link) => link.render(state)))
    return (props?: Partial<Props>) => <Component {...{ Links, ...defaultProps, ...props }} />
  }

  validateConfig = () => {
    const { links } = this._entities
    const errors: ConfigError[] = []
    links.forEach((link) => {
      errors.push(...link.validateConfig())
    })
    return errors
  }
}
