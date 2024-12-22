import type { IDocumentLoaderSpi } from '@domain/services/DocumentLoader'
import { DocumentSpi, type IDocumentDriver } from './DocumentSpi'

export interface IDocumentLoaderDriver {
  fromDocxFile: (path: string) => Promise<IDocumentDriver>
}

export class DocumentLoaderSpi implements IDocumentLoaderSpi {
  constructor(private _driver: IDocumentLoaderDriver) {}

  fromDocxFile = async (path: string): Promise<DocumentSpi> => {
    const spreadsheet = await this._driver.fromDocxFile(path)
    return new DocumentSpi(spreadsheet)
  }
}
