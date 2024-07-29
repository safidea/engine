import type { Paragraph } from '../content/Paragraph'
import type { Title } from '../content/Title'
import type { Image } from '../content/Image'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as ImageProps } from '../content/Image'

export interface Props extends BaseProps {
  Title?: React.FC<Partial<TitleProps>>
  Paragraph?: React.FC<Partial<ParagraphProps>>
  Images: React.FC<Partial<ImageProps>>[]
}

interface Params extends BaseProps {
  images: Image[]
  title?: Title
  paragraph?: Paragraph
  Component: ReactComponent<Props>
}

export class Logos implements Base<Props> {
  constructor(private _params: Params) {}

  init = async () => {
    const { title, paragraph, images } = this._params
    await Promise.all([title?.init(), paragraph?.init(), ...images.map((image) => image.init())])
  }

  render = async () => {
    const { Component, title, paragraph, images, id, className } = this._params
    const Title = title ? await title.render() : undefined
    const Paragraph = paragraph ? await paragraph.render() : undefined
    const Images = await Promise.all(images.map((image) => image.render()))
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Paragraph, Images, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, paragraph, images } = this._params
    const errors: ConfigError[] = []
    if (title) errors.push(...title.validateConfig())
    if (paragraph) errors.push(...paragraph.validateConfig())
    images.forEach((image) => {
      errors.push(...image.validateConfig())
    })
    return errors
  }
}
