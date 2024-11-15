import type { TemplateOutputValue, Template } from './Template'
import type { TemplateCompiler } from './TemplateCompiler'

export interface IDocumentSpi {
  readText: () => string
  writeText: (text: string) => void
  toBuffer: () => Buffer
}

interface DocumentServices {
  templateCompiler: TemplateCompiler
}

export class Document {
  private _template: Template

  constructor(
    private _spi: IDocumentSpi,
    services: DocumentServices
  ) {
    const { templateCompiler } = services
    const content = _spi.readText()
    this._template = templateCompiler.compile(content)
  }

  fill = (data: { [key: string]: TemplateOutputValue }) => {
    const text = this._template.fillAsString(data)
    this._spi.writeText(text)
  }

  toBuffer = (): Buffer => {
    return this._spi.toBuffer()
  }
}
