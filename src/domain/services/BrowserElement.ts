export interface Spi {
  getAttribute: (attribute: string) => Promise<string | undefined>
  getInputValue: () => Promise<string | undefined>
}

export class BrowserElement {
  constructor(private spi: Spi) {}

  getAttribute = async (attribute: string) => {
    return this.spi.getAttribute(attribute)
  }

  getInputValue = async () => {
    return this.spi.getInputValue()
  }
}
