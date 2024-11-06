import type { Spi } from '@domain/services/SpreadsheetLoader'
import { SpreadsheetSpi, type Driver as SpreadsheetDriver } from './SpreadsheetSpi'

export interface Driver {
  fromXlsxFile: (path: string) => Promise<SpreadsheetDriver>
  fromXlsxBuffer: (buffer: Buffer) => Promise<SpreadsheetDriver>
}

export class SpreadsheetLoaderSpi implements Spi {
  constructor(private _driver: Driver) {}

  fromXlsxFile = async (path: string): Promise<SpreadsheetSpi> => {
    const spreadsheet = await this._driver.fromXlsxFile(path)
    return new SpreadsheetSpi(spreadsheet)
  }

  fromXlsxBuffer = async (buffer: Buffer): Promise<SpreadsheetSpi> => {
    const spreadsheet = await this._driver.fromXlsxBuffer(buffer)
    return new SpreadsheetSpi(spreadsheet)
  }
}
