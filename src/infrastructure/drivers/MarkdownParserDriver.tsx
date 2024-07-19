import type { Driver } from '@adapter/spi/MarkdownParserSpi'
import type { Renderer } from '@domain/services/MarkdownParser'
import parse from 'html-react-parser'
import { JSDOM } from 'jsdom'
import DOMPurify, { type DOMPurifyI } from 'dompurify'
import { marked, type Tokens } from 'marked'

export class MarkdownParserDriver implements Driver {
  private DOMPurify: DOMPurifyI

  constructor() {
    const window = new JSDOM('').window
    this.DOMPurify = DOMPurify(window)
  }

  configRenderer = (renderer: Renderer) => {
    marked.use({
      breaks: true,
      useNewRenderer: true,
      renderer: {
        heading(token: Tokens.Heading): string {
          return renderer.title({ text: token.text, heading: token.depth })
        },
        paragraph(token: Tokens.Paragraph): string {
          const children = token.tokens.map((t) => {
            if (t.type === 'link') {
              return renderer.link({ href: t.href, label: t.text })
            } else if (t.type === 'image') {
              return renderer.image({ src: t.href, alt: t.text })
            } else {
              return t.raw
            }
          })
          return renderer
            .paragraph({ text: '{{children}}' })
            .replace('{{children}}', children.join(''))
        },
        hr(): string {
          return renderer.hr({})
        },
        link(token: Tokens.Link): string {
          return renderer.link({ href: token.href, label: token.text })
        },
        image(token: Tokens.Image): string {
          return renderer.image({ src: token.href, alt: token.text })
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
