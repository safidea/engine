import type { Driver } from '@adapter/spi/MarkdownParserSpi'
import type { Params } from '@domain/services/MarkdownParser'
import parse from 'html-react-parser'
import { JSDOM } from 'jsdom'
import DOMPurify, { type DOMPurifyI } from 'dompurify'
import { marked, type Tokens } from 'marked'

export class MarkdownParserDriver implements Driver {
  private DOMPurify: DOMPurifyI

  constructor(params: Params) {
    const window = new JSDOM('').window
    this.DOMPurify = DOMPurify(window)
    const { components, ui } = params
    marked.use({
      breaks: true,
      useNewRenderer: true,
      renderer: {
        heading(token: Tokens.Heading): string {
          const { Title } = components
          return ui.renderToHtml(<Title text={token.text} heading={token.depth} />)
        },
        paragraph(token: Tokens.Paragraph): string {
          const { Paragraph } = components
          return ui.renderToHtml(<Paragraph text={token.text} />)
        },
      },
    })
  }

  parseToComponent = async (content: string) => {
    const html = await marked.parse(content)
    const cleanHtml = this.DOMPurify.sanitize(html)
    return parse(cleanHtml)
  }
}
