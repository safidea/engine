import type { ConfigError } from '@domain/entities/Error/Config'
import type { Button } from '../base/Button'
import type { Link } from '../content/Link'
import type { Title } from '../content/Title'
import type { Base, BaseProps, BaseServices } from '../base'
import type { Props as TitleProps } from '../content/Title'
import type { Props as LinkProps } from '../content/Link'
import type { Props as ButtonProps } from '../base/Button'
import type { State } from '@domain/entities/Page/State'

import type { Dropdown } from '../base/Dropdown'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Links?: React.FC<Partial<LinkProps>>[]
  Buttons?: React.FC<Partial<ButtonProps>>[]
}

export type Config = BaseProps

export type Services = BaseServices

export interface Entities {
  title: Title
  links?: (Link | Dropdown)[]
  buttons?: Button[]
}

export class Header implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { title, links, buttons } = this._entities
    await Promise.all([
      title.init(),
      ...(links?.map((link) => link.init()) ?? []),
      ...(buttons?.map((button) => button.init()) ?? []),
    ])
  }

  render = async (state: State) => {
    const { title, links = [], buttons = [] } = this._entities
    const { id, className } = this._config
    const Title = await title.render()
    const Links = await Promise.all(links.map((link) => link.render(state)))
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    const Component = this._services.client.components.Header
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Links, Buttons, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, links = [], buttons = [] } = this._entities
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    links.forEach((link) => {
      errors.push(...link.validateConfig())
    })
    buttons.forEach((button) => {
      errors.push(...button.validateConfig())
    })
    return errors
  }
}
