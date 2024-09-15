import type { Paragraph } from '../content/Paragraph'
import type { Title } from '../content/Title'
import type { Image } from '../content/Image'
import type { Base, BaseProps, BaseServices } from '../base'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ParagraphProps } from '../content/Paragraph'
import type { Props as ImageProps } from '../content/Image'
import type { ConfigError } from '@domain/entities/Error/Config'

export interface Props extends BaseProps {
  Image?: React.FC<Partial<ImageProps>>
  Title: React.FC<Partial<TitleProps>>
  Paragraph: React.FC<Partial<ParagraphProps>>
  href?: string
}

export interface Config extends BaseProps {
  href?: string
}

export type Services = BaseServices

export interface Entities {
  title: Title
  paragraph: Paragraph
  image?: Image
}

export class Card implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  init = async () => {
    const { title, paragraph, image } = this._entities
    await Promise.all([title.init(), paragraph.init(), image?.init()])
  }

  render = async () => {
    const { title, paragraph, image } = this._entities
    const { id, className, href } = this._config
    const Component = this._services.client.components.Card
    const Title = await title.render()
    const Paragraph = await paragraph.render()
    const Image = await image?.render()
    return (props?: Partial<Props>) => (
      <Component {...{ id, className, Title, Paragraph, Image, href, ...props }} />
    )
  }

  validateConfig = () => {
    const { title, paragraph, image } = this._entities
    const errors: ConfigError[] = []
    errors.push(...title.validateConfig())
    errors.push(...paragraph.validateConfig())
    if (image) errors.push(...image.validateConfig())
    return errors
  }
}
