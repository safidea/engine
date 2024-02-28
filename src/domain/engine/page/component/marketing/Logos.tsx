import type { Paragraph } from '../base/Paragraph'
import type { Title } from '../base/Title'
import type { Image } from '../base/Image'
import type { ReactComponent, Base, BaseProps } from '../base/base'
import type { ConfigError } from '@domain/entities/error/Config'

export interface Props extends BaseProps {
  Title?: React.FC
  Paragraph?: React.FC
  Images: React.FC[]
}

interface Params {
  images: Image[]
  title?: Title
  paragraph?: Paragraph
  Component: ReactComponent<Props>
}

export class Logos implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {
    const { title, paragraph, images } = this.params
    await Promise.all([title?.init(), paragraph?.init(), ...images.map((image) => image.init())])
  }

  render = async () => {
    const { Component, title, paragraph, images } = this.params
    const Title = title ? await title.render() : undefined
    const Paragraph = paragraph ? await paragraph.render() : undefined
    const Images = await Promise.all(images.map((image) => image.render()))
    return (props?: Partial<Props>) => <Component {...{ Title, Paragraph, Images, ...props }} />
  }

  validateConfig = () => {
    const { title, paragraph, images } = this.params
    const errors: ConfigError[] = []
    if (title) errors.push(...title.validateConfig())
    if (paragraph) errors.push(...paragraph.validateConfig())
    images.forEach((image) => {
      errors.push(...image.validateConfig())
    })
    return errors
  }
}
