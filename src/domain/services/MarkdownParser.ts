export interface Spi {
  parseToComponent: (content: string) => Promise<React.ReactNode>
}

export class MarkdownParser {
  constructor(private spi: Spi) {}

  parseToComponent = async (content: string) => {
    return this.spi.parseToComponent(content)
  }
}
