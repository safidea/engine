import type { Driver } from '@adapter/spi/drivers/DocumentLoaderSpi'
import type { Driver as DocumentDriver } from '@adapter/spi/drivers/DocumentSpi'
import { DocxDriver } from './DocxDriver'

export class DocumentLoaderDriver implements Driver {
  fromDocxFile = async (path: string): Promise<DocumentDriver> => {
    return new DocxDriver(path)
  }
}
