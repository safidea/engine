import type { ConfigError } from '@domain/entities/Error/Config'
import type { Button } from '../base/Button'
import type { Paragraph } from '../content/Paragraph'
import type { Title } from '../content/Title'
import type { Base, BaseProps, ReactComponent } from '../base/base'
import type { Props as ButtonProps } from '../base/Button'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as TitleProps } from '../content/Title'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  Button: React.FC<Partial<ButtonProps>>
}

interface Params {
  title: Title
  paragraph: Paragraph
  button: Button
  Component: ReactComponent<Props>
}

export class NotFound implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { title, paragraph, button } = this._params
    await Promise.all([title.init(), paragraph.init(), button.init()])
  }

  render = async (state: State) => {
    const { Component, title, paragraph, button } = this._params
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Button = await button.render(state)
    return (props?: Partial<Props>) => <Component {...{ Title, Paragraph, Button, ...props }} />
  }

  validateConfig = () => {
    const { title, paragraph, button } = this._params
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    errors.push(...paragraph.validateConfig())
    errors.push(...button.validateConfig())
    return errors
  }
}
