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
    const renderer = {
      heading(token: Tokens.Heading): string {
        const { Title } = components
        return ui.renderToHtml(<Title text={token.text} heading={token.depth} />)
      },
      paragraph(token: Tokens.Paragraph): string {
        const { Paragraph, Link, Image } = components
        const children = token.tokens.map((t, i) => {
          if (t.type === 'link') {
            return <Link key={i} href={t.href} label={t.text} />
          } else if (t.type === 'image') {
            return <Image key={i} src={t.href} alt={t.text} />
          } else {
            return t.raw
          }
        })
        return ui.renderToHtml(<Paragraph>{children}</Paragraph>)
      },
      hr(): string {
        const { Divider } = components
        return ui.renderToHtml(<Divider />)
      },
      link(token: Tokens.Link): string {
        const { Link } = components
        return ui.renderToHtml(<Link href={token.href} label={token.text} />)
      },
      image(token: Tokens.Image): string {
        const { Image } = components
        return ui.renderToHtml(<Image src={token.href} alt={token.text} />)
      },
    }
    marked.use({
      breaks: true,
      useNewRenderer: true,
      renderer,
    })
  }

  parseToComponent = async (content: string) => {
    const html = await marked.parse(content)
    const cleanHtml = this.DOMPurify.sanitize(html)
    return parse(cleanHtml)
  }
}
