import type { Spi } from '@domain/services/Document'

export interface Driver {
  readText: () => string
  writeText: (text: string) => void
  toBuffer: () => Buffer
}

export class DocumentSpi implements Spi {
  constructor(private _driver: Driver) {}

  readText = (): string => {
    return this._driver.readText()
  }

  writeText = (text: string) => {
    this._driver.writeText(text)
  }

  toBuffer = (): Buffer => {
    return this._driver.toBuffer()
  }
}
