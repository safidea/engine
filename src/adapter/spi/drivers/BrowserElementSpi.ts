import type { IBrowserElementSpi } from '@domain/services/BrowserElement'

export interface IBrowserElementDriver {
  getAttribute(attribute: string): Promise<string | undefined>
  getInputValue(): Promise<string | undefined>
}

export class BrowserElementSpi implements IBrowserElementSpi {
  constructor(private _driver: IBrowserElementDriver) {}

  getAttribute = async (attribute: string) => {
    return this._driver.getAttribute(attribute)
  }

  getInputValue = async () => {
    return this._driver.getInputValue()
  }
}
