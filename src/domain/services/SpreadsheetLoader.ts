import { Spreadsheet, type Spi as SpreadsheetSpi } from './Spreadsheet'
import type { TemplateCompiler } from './TemplateCompiler'

export interface Spi {
  fromXlsxFile: (path: string) => Promise<SpreadsheetSpi>
  fromXlsxBuffer: (buffer: Buffer) => Promise<SpreadsheetSpi>
}

export interface Services {
  templateCompiler: TemplateCompiler
}

export class SpreadsheetLoader {
  constructor(
    private _spi: Spi,
    private _services: Services
  ) {}

  fromXlsxFile = async (path: string): Promise<Spreadsheet> => {
    const spreadsheet = await this._spi.fromXlsxFile(path)
    return new Spreadsheet(spreadsheet, this._services)
  }

  fromXlsxBuffer = async (buffer: Buffer): Promise<Spreadsheet> => {
    const spreadsheet = await this._spi.fromXlsxBuffer(buffer)
    return new Spreadsheet(spreadsheet, this._services)
  }
}
