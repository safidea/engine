import type { ConfigError } from '@domain/entities/Error/Config'
import type { Button } from '../base/Button'
import type { Title } from '../content/Title'
import type { Base, BaseProps, BaseServices } from '../base'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ButtonProps } from '../base/Button'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Buttons?: React.FC<Partial<ButtonProps>>[]
}

export type Config = BaseProps

export type Services = BaseServices

export interface Entities {
  title: Title
  buttons?: Button[]
}

export class Heading implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { title, buttons } = this._entities
    await Promise.all([title.init(), ...(buttons?.map((button) => button.init()) ?? [])])
  }

  render = async (state: State) => {
    const { title, buttons = [] } = this._entities
    const { id, className } = this._config
    const Title = await title.render()
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    const Component = this._services.client.components.Heading
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Buttons, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, buttons = [] } = this._entities
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    buttons.forEach((button) => {
      errors.push(...button.validateConfig())
    })
    return errors
  }
}
