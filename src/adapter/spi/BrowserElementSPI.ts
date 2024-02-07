import type { Spi } from '@domain/services/BrowserElement'

export interface Driver {
  getAttribute(attribute: string): Promise<string | undefined>
  getValue(): Promise<string | undefined>
  type(value: string): Promise<void>
}

export class BrowserElementSpi implements Spi {
  constructor(private driver: Driver) {}

  async getAttribute(attribute: string) {
    return this.driver.getAttribute(attribute)
  }

  async getValue() {
    return this.driver.getValue()
  }

  async type(value: string) {
    return this.driver.type(value)
  }
}
