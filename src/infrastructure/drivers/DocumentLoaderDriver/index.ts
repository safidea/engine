import type { Driver } from '@adapter/spi/DocumentLoaderSpi'
import type { Driver as DocumentDriver } from '@adapter/spi/DocumentSpi'
import { DocxDriver } from './DocxDriver'

export class DocumentLoaderDriver implements Driver {
  fromDocxFile = async (path: string): Promise<DocumentDriver> => {
    return new DocxDriver(path)
  }
}
