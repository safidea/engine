import type { Spi } from '@domain/services/MarkdownParser'

export interface Driver {
  parseToComponent: (content: string) => Promise<React.ReactNode>
}

export class MarkdownParserSpi implements Spi {
  constructor(private driver: Driver) {}

  parseToComponent = async (content: string) => {
    return this.driver.parseToComponent(content)
  }
}
