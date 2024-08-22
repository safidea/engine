import type { ReactComponents } from '@domain/entities/Component'
import type { React } from './React'
import type { Props as TitleProps } from '@domain/entities/Component/content/Title'
import type { Props as ParagraphProps } from '@domain/entities/Component/content/Paragraph'
import type { Props as DividerProps } from '@domain/entities/Component/content/Divider'
import type { Props as LinkProps } from '@domain/entities/Component/content/Link'
import type { Props as ImageProps } from '@domain/entities/Component/content/Image'

export interface Services {
  components: ReactComponents
  react: React
}

export interface Renderer {
  title: (props: TitleProps) => string
  paragraph: (props: ParagraphProps) => string
  hr: (props: DividerProps) => string
  link: (props: LinkProps) => string
  image: (props: ImageProps) => string
}

export interface Spi {
  parseToComponent: (content: string) => Promise<React.ReactNode>
  configRenderer: (renderer: Renderer) => void
}

export class MarkdownParser {
  constructor(
    private _spi: Spi,
    private _services: Services
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
    const { components, react } = this._services
    const { Title } = components
    return react.renderToHtml(<Title {...props} />)
  }

  renderParagraph = (props: ParagraphProps): string => {
    const { components, react } = this._services
    const { Paragraph } = components
    return react.renderToHtml(<Paragraph {...props} />)
  }

  renderDivider = (props: DividerProps): string => {
    const { components, react } = this._services
    const { Divider } = components
    return react.renderToHtml(<Divider {...props} />)
  }

  renderLink = (props: LinkProps): string => {
    const { components, react } = this._services
    const { Link } = components
    return react.renderToHtml(<Link {...props} />)
  }

  renderImage = (props: ImageProps): string => {
    const { components, react } = this._services
    const { Image } = components
    return react.renderToHtml(<Image {...props} />)
  }
}
