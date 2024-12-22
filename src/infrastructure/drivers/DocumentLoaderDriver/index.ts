import type { IDocumentLoaderDriver } from '@adapter/spi/drivers/DocumentLoaderSpi'
import { DocxDriver } from './DocxDriver'

export class DocumentLoaderDriver implements IDocumentLoaderDriver {
  fromDocxFile = async (path: string) => {
    return new DocxDriver(path)
  }
}
