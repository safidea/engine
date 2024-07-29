import type { ConfigError } from '@domain/entities/Error/Config'
import type { Button } from '../base/Button'
import type { Paragraph } from '../content/Paragraph'
import type { Title } from '../content/Title'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as ButtonProps } from '../base/Button'
import type { State } from '@domain/entities/Page/State'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  Buttons: React.FC<Partial<ButtonProps>>[]
}

interface Params extends BaseProps {
  title: Title
  paragraph: Paragraph
  buttons: Button[]
  Component: ReactComponent<Props>
}

export class Hero implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { title, paragraph, buttons } = this._params
    await Promise.all([title.init(), paragraph.init(), ...buttons.map((button) => button.init())])
  }

  render = async (state: State) => {
    const { Component, title, paragraph, buttons, id, className } = this._params
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Paragraph, Buttons, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, paragraph, buttons } = this._params
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    errors.push(...paragraph.validateConfig())
    buttons.forEach((button) => {
      errors.push(...button.validateConfig())
    })
    return errors
  }
}
