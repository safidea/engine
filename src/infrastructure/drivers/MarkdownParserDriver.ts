import type { Driver } from '@adapter/spi/MarkdownParserSpi'
import parse from 'html-react-parser'
import { JSDOM } from 'jsdom'
import DOMPurify, { type DOMPurifyI } from 'dompurify'
import { marked } from 'marked'

export class MarkdownParserDriver implements Driver {
  private DOMPurify: DOMPurifyI

  constructor() {
    const window = new JSDOM('').window
    this.DOMPurify = DOMPurify(window)
    /*marked.use({
      breaks: true,
      renderer: {
        heading(token: Tokens.Heading): string {
          return `<h${token.depth}>${token.text}</h${token.depth}>`
        },
      },
    })*/
  }

  parseToComponent = async (content: string) => {
    const html = await marked.parse(content)
    const cleanHtml = this.DOMPurify.sanitize(html)
    return parse(cleanHtml)
  }
}
