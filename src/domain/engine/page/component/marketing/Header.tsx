import type { ConfigError } from '@domain/entities/error/Config'
import type { Button } from '../base/Button'
import type { Link } from '../base/Link'
import type { Title } from '../base/Title'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Props as TitleProps } from '../base/Title'
import type { Props as LinkProps } from '../base/Link'
import type { Props as ButtonProps } from '../base/Button'
import type { State } from '../../State'
import type { Dropdown } from '../base/Dropdown'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Links?: React.FC<Partial<LinkProps>>[]
  Buttons?: React.FC<Partial<ButtonProps>>[]
}

interface Params extends BaseProps {
  title: Title
  links?: (Link | Dropdown)[]
  buttons?: Button[]
  Component: ReactComponent<Props>
}

export class Header implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { title, links, buttons } = this.params
    await Promise.all([
      title.init(),
      ...(links?.map((link) => link.init()) ?? []),
      ...(buttons?.map((button) => button.init()) ?? []),
    ])
  }

  render = async (state: State) => {
    const { id, className, title, links = [], buttons = [], Component } = this.params
    const Title = await title.render()
    const Links = await Promise.all(links.map((link) => link.render(state)))
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Links, Buttons, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, links = [], buttons = [] } = this.params
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
