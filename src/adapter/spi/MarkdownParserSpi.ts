import type { Spi, Renderer } from '@domain/services/MarkdownParser'

export interface Driver {
  parseToComponent: (content: string) => Promise<React.ReactNode>
  configRenderer: (render: Renderer) => void
}

export class MarkdownParserSpi implements Spi {
  constructor(private driver: Driver) {}

  parseToComponent = async (content: string) => {
    return this.driver.parseToComponent(content)
  }

  configRenderer = (renderer: Renderer) => {
    this.driver.configRenderer(renderer)
  }
}
