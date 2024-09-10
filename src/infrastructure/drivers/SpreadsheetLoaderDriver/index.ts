import type { Driver } from '@adapter/spi/SpreadsheetLoaderSpi'
import type { Driver as SpreadsheetDriver } from '@adapter/spi/SpreadsheetSpi'
import { XlsxDriver } from './XlsxDriver'

export class SpreadsheetLoaderDriver implements Driver {
  fromXlsxFile = async (path: string): Promise<SpreadsheetDriver> => {
    const spreadsheet = new XlsxDriver()
    await spreadsheet.loadFile(path)
    return spreadsheet
  }

  fromXlsxBuffer = async (buffer: Buffer): Promise<SpreadsheetDriver> => {
    const spreadsheet = new XlsxDriver()
    await spreadsheet.loadBuffer(buffer)
    return spreadsheet
  }
}
