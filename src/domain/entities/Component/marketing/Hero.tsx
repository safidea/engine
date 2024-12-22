import type { ConfigError } from '@domain/entities/Error/Config'
import type { Button } from '../base/Button'
import type { Paragraph } from '../content/Paragraph'
import type { Title } from '../content/Title'
import type { Base, BaseProps, BaseServices } from '../base'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as ButtonProps } from '../base/Button'
import type { PageState } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  Buttons: React.FC<Partial<ButtonProps>>[]
}

export type Config = BaseProps

export type Services = BaseServices

export interface Entities {
  title: Title
  paragraph: Paragraph
  buttons: Button[]
}

export class Hero implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { title, paragraph, buttons } = this._entities
    await Promise.all([title.init(), paragraph.init(), ...buttons.map((button) => button.init())])
  }

  render = async (state: PageState) => {
    const { title, paragraph, buttons } = this._entities
    const { id, className } = this._config
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    const Component = this._services.client.components.Hero
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Paragraph, Buttons, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, paragraph, buttons } = this._entities
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    errors.push(...paragraph.validateConfig())
    buttons.forEach((button) => {
      errors.push(...button.validateConfig())
    })
    return errors
  }
}
