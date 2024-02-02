import type { BrowserElementDriver } from './BrowserElementSpi'
import type { BrowserPageSpi as IBrowserPageSpi } from '@domain/services/BrowserPage'

export interface BrowserPageDriver {
  open(url: string): Promise<void>
  title(): Promise<string>
  getByText(text: string, options?: { tag?: string }): Promise<BrowserElementDriver | undefined>
  getInputByName(input: string): Promise<BrowserElementDriver | undefined>
}

export class BrowserPageSpi implements IBrowserPageSpi {
  constructor(private driver: BrowserPageDriver) {}

  async open(url: string) {
    return this.driver.open(url)
  }

  async title() {
    return this.driver.title()
  }

  async getByText(text: string, options?: { tag?: string }) {
    return this.driver.getByText(text, options)
  }

  async getInputByName(input: string) {
    return this.driver.getInputByName(input)
  }
}
