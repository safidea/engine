export interface BrowserPageSpi {
  getAttribute: (attribute: string) => Promise<string | undefined>
  getValue: () => Promise<string | undefined>
  type: (value: string) => Promise<void>
}

export class BrowserElement {
  constructor(private spi: BrowserPageSpi) {}

  async getAttribute(attribute: string) {
    return this.spi.getAttribute(attribute)
  }

  async getValue() {
    return this.spi.getValue()
  }

  async type(value: string) {
    await this.spi.type(value)
  }
}
