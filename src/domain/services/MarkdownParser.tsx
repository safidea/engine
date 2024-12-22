import type { Props as TitleProps } from '@domain/entities/Component/content/Title'
import type { Props as ParagraphProps } from '@domain/entities/Component/content/Paragraph'
import type { Props as DividerProps } from '@domain/entities/Component/content/Divider'
import type { Props as LinkProps } from '@domain/entities/Component/content/Link'
import type { Props as ImageProps } from '@domain/entities/Component/content/Image'
import type { Client } from './Client'

export interface MarkdownParserServices {
  client: Client
}

export interface MarkdownParserRenderer {
  title: (props: TitleProps) => string
  paragraph: (props: ParagraphProps) => string
  hr: (props: DividerProps) => string
  link: (props: LinkProps) => string
  image: (props: ImageProps) => string
}

export interface IMarkdownParserSpi {
  parseToComponent: (content: string) => Promise<React.ReactNode>
  configRenderer: (renderer: MarkdownParserRenderer) => void
}

export class MarkdownParser {
  constructor(
    private _spi: IMarkdownParserSpi,
    private _services: MarkdownParserServices
  ) {
    this._spi.configRenderer({
      title: this.renderTitle,
      paragraph: this.renderParagraph,
      hr: this.renderDivider,
      link: this.renderLink,
      image: this.renderImage,
    })
  }

  parseToComponent = async (content: string) => {
    return this._spi.parseToComponent(content)
  }

  renderTitle = (props: TitleProps): string => {
    const { client } = this._services
    const { Title } = client.components
    return client.renderToHtml(<Title {...props} />)
  }

  renderParagraph = (props: ParagraphProps): string => {
    const { client } = this._services
    const { Paragraph } = client.components
    return client.renderToHtml(<Paragraph {...props} />)
  }

  renderDivider = (props: DividerProps): string => {
    const { client } = this._services
    const { Divider } = client.components
    return client.renderToHtml(<Divider {...props} />)
  }

  renderLink = (props: LinkProps): string => {
    const { client } = this._services
    const { Link } = client.components
    return client.renderToHtml(<Link {...props} />)
  }

  renderImage = (props: ImageProps): string => {
    const { client } = this._services
    const { Image } = client.components
    return client.renderToHtml(<Image {...props} />)
  }
}
