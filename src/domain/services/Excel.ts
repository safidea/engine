import { ExcelWorkbook, type Spi as ExcelWorkbookSpi } from './ExcelWorkbook'

export interface Spi {
  workbookFromFile: (path: string) => Promise<ExcelWorkbookSpi>
  workbookFromBuffer: (buffer: Buffer) => Promise<ExcelWorkbookSpi>
}

export class Excel {
  constructor(private _spi: Spi) {}

  workbookFromFile = async (path: string): Promise<ExcelWorkbook> => {
    const workbook = await this._spi.workbookFromFile(path)
    return new ExcelWorkbook(workbook)
  }

  workbookFromBuffer = async (buffer: Buffer): Promise<ExcelWorkbook> => {
    const workbook = await this._spi.workbookFromBuffer(buffer)
    return new ExcelWorkbook(workbook)
  }
}
