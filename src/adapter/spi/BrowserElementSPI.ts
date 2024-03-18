import type { Spi } from '@domain/services/BrowserElement'

export interface Driver {
  getAttribute(attribute: string): Promise<string | undefined>
  getInputValue(): Promise<string | undefined>
}

export class BrowserElementSpi implements Spi {
  constructor(private driver: Driver) {}

  getAttribute = async (attribute: string) => {
    return this.driver.getAttribute(attribute)
  }

  getInputValue = async () => {
    return this.driver.getInputValue()
  }
}
