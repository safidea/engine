import type { Driver as BrowserElementDriver } from './BrowserElementSpi'
import type { Spi } from '@domain/services/BrowserPage'

export interface Driver {
  open(url: string): Promise<boolean>
  type(inputName: string, value: string): Promise<boolean>
  click(text: string): Promise<boolean>
  waitForText(text: string, options: { timeout: number }): Promise<boolean>
  getTitle(): Promise<string>
  getByText(text: string, options?: { tag?: string }): Promise<BrowserElementDriver | undefined>
  getByAttribute(
    attribute: string,
    value: string,
    options?: { tag?: string }
  ): Promise<BrowserElementDriver | undefined>
  getHtml(): Promise<string>
}

export class BrowserPageSpi implements Spi {
  constructor(private driver: Driver) {}

  open = async (url: string) => {
    return this.driver.open(url)
  }

  type = async (inputName: string, value: string) => {
    return this.driver.type(inputName, value)
  }

  click = async (text: string) => {
    return this.driver.click(text)
  }

  waitForText = async (text: string, options: { timeout: number }) => {
    return this.driver.waitForText(text, options)
  }

  getTitle = async () => {
    return this.driver.getTitle()
  }

  getByText = async (text: string, options?: { tag?: string }) => {
    return this.driver.getByText(text, options)
  }

  getByAttribute = async (attribute: string, value: string, options?: { tag?: string }) => {
    return this.driver.getByAttribute(attribute, value, options)
  }

  getHtml = async () => {
    return this.driver.getHtml()
  }
}
