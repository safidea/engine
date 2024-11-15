import type { IDocumentSpi } from '@domain/services/Document'

export interface IDocumentDriver {
  readText: () => string
  writeText: (text: string) => void
  toBuffer: () => Buffer
}

export class DocumentSpi implements IDocumentSpi {
  constructor(private _driver: IDocumentDriver) {}

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
