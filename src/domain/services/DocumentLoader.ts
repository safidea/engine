import { Document, type Spi as DocumentSpi } from './Document'
import type { TemplateCompiler } from './TemplateCompiler'

export interface Spi {
  fromDocxFile: (path: string) => Promise<DocumentSpi>
}

export interface Services {
  templateCompiler: TemplateCompiler
}

export class DocumentLoader {
  constructor(
    private _spi: Spi,
    private _service: Services
  ) {}

  fromDocxFile = async (path: string): Promise<Document> => {
    const document = await this._spi.fromDocxFile(path)
    return new Document(document, this._service)
  }
}
