import type { ConfigError } from '@domain/entities/error/Config'
import type { Button } from '../base/Button'
import type { Paragraph } from '../base/Paragraph'
import type { Title } from '../base/Title'
import type { Base, BaseProps, ReactComponent } from '../base/base'
import type { Props as ButtonProps } from '../base/Button'
import type { Props as ParagraphProps } from '../base/Paragraph'
import type { Props as TitleProps } from '../base/Title'
import type { State } from '../../State'

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
  constructor(private params: Params) {}

  init = async () => {
    const { title, paragraph, button } = this.params
    await Promise.all([title.init(), paragraph.init(), button.init()])
  }

  render = async (state: State) => {
    const { Component, title, paragraph, button } = this.params
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Button = await button.render(state)
    return (props?: Partial<Props>) => <Component {...{ Title, Paragraph, Button, ...props }} />
  }

  validateConfig = () => {
    const { title, paragraph, button } = this.params
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    errors.push(...paragraph.validateConfig())
    errors.push(...button.validateConfig())
    return errors
  }
}
