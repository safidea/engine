import type { MarkdownParser } from '@domain/services/MarkdownParser'
import type { ReactComponent, Base, BaseProps, Font } from '../base/base'

export interface Props extends BaseProps {
  Content: React.ReactNode
  font?: Font
}

interface Params extends BaseProps {
  content: string
  Component: ReactComponent<Props>
  markdownParser: MarkdownParser
  font?: Font
}

export class Markdown implements Base<Props> {
  constructor(private params: Params) {}

  init = async () => {}

  render = async () => {
    const { markdownParser, Component, content, ...defaultProps } = this.params
    const Content = await markdownParser.parseToComponent(content)
    return (props?: Partial<Props>) => <Component {...{ ...defaultProps, Content, ...props }} />
  }

  validateConfig = () => {
    return []
  }
}
