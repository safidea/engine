export interface IBrowserElementSpi {
  getAttribute: (attribute: string) => Promise<string | undefined>
  getInputValue: () => Promise<string | undefined>
}

export class BrowserElement {
  constructor(private _spi: IBrowserElementSpi) {}

  getAttribute = async (attribute: string) => {
    return this._spi.getAttribute(attribute)
  }

  getInputValue = async () => {
    return this._spi.getInputValue()
  }
}
