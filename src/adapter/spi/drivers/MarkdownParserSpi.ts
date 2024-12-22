import type { IMarkdownParserSpi, MarkdownParserRenderer } from '@domain/services/MarkdownParser'

export interface IMarkdownParserDriver {
  parseToComponent: (content: string) => Promise<React.ReactNode>
  configRenderer: (render: MarkdownParserRenderer) => void
}

export class MarkdownParserSpi implements IMarkdownParserSpi {
  constructor(private _driver: IMarkdownParserDriver) {}

  parseToComponent = async (content: string) => {
    return this._driver.parseToComponent(content)
  }

  configRenderer = (renderer: MarkdownParserRenderer) => {
    this._driver.configRenderer(renderer)
  }
}
