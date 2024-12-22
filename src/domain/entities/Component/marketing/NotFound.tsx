import type { ConfigError } from '@domain/entities/Error/Config'
import type { Button } from '../base/Button'
import type { Paragraph } from '../content/Paragraph'
import type { Title } from '../content/Title'
import type { Base, BaseProps, BaseServices } from '../base'
import type { Props as ButtonProps } from '../base/Button'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as TitleProps } from '../content/Title'
import type { PageState } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  Button: React.FC<Partial<ButtonProps>>
}

export type Config = BaseProps

export type Services = BaseServices

export interface Entities {
  title: Title
  paragraph: Paragraph
  button: Button
}

export class NotFound implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { title, paragraph, button } = this._entities
    await Promise.all([title.init(), paragraph.init(), button.init()])
  }

  render = async (state: PageState) => {
    const { title, paragraph, button } = this._entities
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Button = await button.render(state)
    const Component = this._services.client.components.NotFound
    return (props?: Partial<Props>) => (
      <Component {...{ ...this._config, Title, Paragraph, Button, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, paragraph, button } = this._entities
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    errors.push(...paragraph.validateConfig())
    errors.push(...button.validateConfig())
    return errors
  }
}
