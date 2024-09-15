import type { MarkdownParser } from '@domain/services/MarkdownParser'
import type { Base, BaseProps, Font, BaseServices } from '../base'

export interface Props extends BaseProps {
  Content: React.ReactNode
  font?: Font
}

export interface Config extends BaseProps {
  content: string
  font?: Font
}

export interface Services extends BaseServices {
  markdownParser: MarkdownParser
}

export class Markdown implements Base<Props> {
  constructor(
    private _config: Config,
    private _services: Services
  ) {}

  init = async () => {}

  render = async () => {
    const { content, ...defaultProps } = this._config
    const { markdownParser, client } = this._services
    const Component = client.components.Markdown
    const Content = await markdownParser.parseToComponent(content)
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, Content, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
