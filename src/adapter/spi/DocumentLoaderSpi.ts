import type { Spi } from '@domain/services/DocumentLoader'
import { DocumentSpi, type Driver as DocumentDriver } from './DocumentSpi'

export interface Driver {
  fromDocxFile: (path: string) => Promise<DocumentDriver>
}

export class DocumentLoaderSpi implements Spi {
  constructor(private _driver: Driver) {}

  fromDocxFile = async (path: string): Promise<DocumentSpi> => {
    const spreadsheet = await this._driver.fromDocxFile(path)
    return new DocumentSpi(spreadsheet)
  }
}
