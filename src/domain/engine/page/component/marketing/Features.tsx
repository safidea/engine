import type { ConfigError } from '@domain/entities/error/Config'
import type { Icon } from '../base/Icon'
import type { Paragraph } from '../base/Paragraph'
import type { Title } from '../base/Title'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { Props as TitleProps } from '../base/Title'
import type { Props as IconProps } from '../base/Icon'
import type { Props as ParagraphProps } from '../base/Paragraph'

export interface Props extends BaseProps {
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  Features: {
    Title: React.FC<Partial<TitleProps>>
    Paragraph: React.FC<Partial<ParagraphProps>>
    Icon: React.FC<Partial<IconProps>>
  }[]
}

interface Params extends BaseProps {
  title: Title
  paragraph: Paragraph
  features: {
    title: Title
    paragraph: Paragraph
    icon: Icon
  }[]
  Component: ReactComponent<Props>
}

export class Features implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { title, paragraph, features } = this.params
    await Promise.all([
      title.init(),
      paragraph.init(),
      ...features.map(async ({ title, paragraph, icon }) => {
        await title.init()
        await paragraph.init()
        await icon.init()
      }),
    ])
  }

  render = async () => {
    const { Component, title, paragraph, features, id, className } = this.params
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Features = await Promise.all(
      features.map(async ({ title, paragraph, icon }) => ({
        Title: await title.render(),
        Paragraph: await paragraph.render(),
        Icon: await icon.render(),
      }))
    )
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Paragraph, Features, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, paragraph, features } = this.params
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    errors.push(...paragraph.validateConfig())
    features.forEach(({ title, paragraph, icon }) => {
      errors.push(...title.validateConfig())
      errors.push(...paragraph.validateConfig())
      errors.push(...icon.validateConfig())
    })
    return errors
  }
}
