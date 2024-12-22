import { Spreadsheet, type ISpreadsheetSpi } from './Spreadsheet'
import type { TemplateCompiler } from './TemplateCompiler'

export interface ISpreadsheetLoaderSpi {
  fromXlsxFile: (path: string) => Promise<ISpreadsheetSpi>
  fromXlsxBuffer: (buffer: Buffer) => Promise<ISpreadsheetSpi>
}

export interface SpreadsheetLoaderServices {
  templateCompiler: TemplateCompiler
}

export class SpreadsheetLoader {
  constructor(
    private _spi: ISpreadsheetLoaderSpi,
    private _services: SpreadsheetLoaderServices
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
