import { Document, type IDocumentSpi } from './Document'
import type { TemplateCompiler } from './TemplateCompiler'

export interface IDocumentLoaderSpi {
  fromDocxFile: (path: string) => Promise<IDocumentSpi>
}

export interface DocumentLoaderServices {
  templateCompiler: TemplateCompiler
}

export class DocumentLoader {
  constructor(
    private _spi: IDocumentLoaderSpi,
    private _service: DocumentLoaderServices
  ) {}

  fromDocxFile = async (path: string): Promise<Document> => {
    const document = await this._spi.fromDocxFile(path)
    return new Document(document, this._service)
  }
}
