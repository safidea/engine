export interface Spi {
  getAttribute: (attribute: string) => Promise<string | undefined>
  getInputValue: () => Promise<string | undefined>
}

export class BrowserElement {
  constructor(private _spi: Spi) {}

  getAttribute = async (attribute: string) => {
    return this._spi.getAttribute(attribute)
  }

  getInputValue = async () => {
    return this._spi.getInputValue()
  }
}
