import type { ConfigError } from '@domain/entities/error/Config'
import type { Button } from '../base/Button'
import type { Title } from '../base/Title'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Props as TitleProps } from '../base/Title'
import type { Props as ButtonProps } from '../base/Button'
import type { State } from '../../State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Buttons?: React.FC<Partial<ButtonProps>>[]
}

interface Params extends BaseProps {
  title: Title
  buttons?: Button[]
  Component: ReactComponent<Props>
}

export class Heading implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { title, buttons } = this.params
    await Promise.all([title.init(), ...(buttons?.map((button) => button.init()) ?? [])])
  }

  render = async (state: State) => {
    const { id, className, title, buttons = [], Component } = this.params
    const Title = await title.render()
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Buttons, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, buttons = [] } = this.params
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    buttons.forEach((button) => {
      errors.push(...button.validateConfig())
    })
    return errors
  }
}
