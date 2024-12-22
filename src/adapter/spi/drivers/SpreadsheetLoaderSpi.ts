import type { ISpreadsheetLoaderSpi } from '@domain/services/SpreadsheetLoader'
import { SpreadsheetSpi, type ISpreadsheetDriver } from './SpreadsheetSpi'

export interface ISpreadsheetLoaderDriver {
  fromXlsxFile: (path: string) => Promise<ISpreadsheetDriver>
  fromXlsxBuffer: (buffer: Buffer) => Promise<ISpreadsheetDriver>
}

export class SpreadsheetLoaderSpi implements ISpreadsheetLoaderSpi {
  constructor(private _driver: ISpreadsheetLoaderDriver) {}

  fromXlsxFile = async (path: string): Promise<SpreadsheetSpi> => {
    const spreadsheet = await this._driver.fromXlsxFile(path)
    return new SpreadsheetSpi(spreadsheet)
  }

  fromXlsxBuffer = async (buffer: Buffer): Promise<SpreadsheetSpi> => {
    const spreadsheet = await this._driver.fromXlsxBuffer(buffer)
    return new SpreadsheetSpi(spreadsheet)
  }
}
