import type { OutputValue, Template } from './Template'
import type { TemplateCompiler } from './TemplateCompiler'

export interface Spi {
  readText: () => string
  writeText: (text: string) => void
  toBuffer: () => Buffer
}

interface Services {
  templateCompiler: TemplateCompiler
}

export class Document {
  private _template: Template

  constructor(
    private _spi: Spi,
    services: Services
  ) {
    const { templateCompiler } = services
    const content = _spi.readText()
    this._template = templateCompiler.compile(content)
  }

  fill = (data: { [key: string]: OutputValue }) => {
    const text = this._template.fillAsString(data)
    this._spi.writeText(text)
  }

  toBuffer = (): Buffer => {
    return this._spi.toBuffer()
  }
}
