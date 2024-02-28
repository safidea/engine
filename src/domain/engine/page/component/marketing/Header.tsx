import type { ConfigError } from '@domain/entities/error/Config'
import type { Button } from '../base/Button'
import type { Link } from '../base/Link'
import type { Title } from '../base/Title'
import type { ReactComponent, Base, BaseProps } from '../base/base'

export interface Props extends BaseProps {
  Title: React.FC
  Links?: React.FC[]
  Buttons?: React.FC[]
}

interface Params {
  title: Title
  links?: Link[]
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

  render = async () => {
    const { title, links = [], buttons = [], Component } = this.params
    const Title = await title.render()
    const Links = await Promise.all(links.map((link) => link.render()))
    const Buttons = await Promise.all(buttons.map((button) => button.render()))
    return (props?: Partial<Props>) => <Component {...{ Title, Links, Buttons, ...props }} />
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
