import type { BrowserElementSpi as IBrowserElementSpi } from '@domain/services/BrowserElement'

export interface BrowserElementDriver {
  getAttribute(attribute: string): Promise<string | undefined>
  getValue(): Promise<string | undefined>
  type(value: string): Promise<void>
}

export class BrowserElementSpi implements IBrowserElementSpi {
  constructor(private driver: BrowserElementDriver) {}

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
