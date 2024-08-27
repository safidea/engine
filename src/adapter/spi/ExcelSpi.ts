import type { Spi } from '@domain/services/Excel'
import { ExcelWorkbookSpi, type Driver as ExcelWorkbookDriver } from './ExcelWorkbookSpi'

export interface Driver {
  workbookFromFile: (path: string) => Promise<ExcelWorkbookDriver>
  workbookFromBuffer: (buffer: Buffer) => Promise<ExcelWorkbookDriver>
}

export class ExcelSpi implements Spi {
  constructor(private _driver: Driver) {}

  workbookFromFile = async (path: string): Promise<ExcelWorkbookSpi> => {
    const workbook = await this._driver.workbookFromFile(path)
    return new ExcelWorkbookSpi(workbook)
  }

  workbookFromBuffer = async (buffer: Buffer): Promise<ExcelWorkbookSpi> => {
    const workbook = await this._driver.workbookFromBuffer(buffer)
    return new ExcelWorkbookSpi(workbook)
  }
}
