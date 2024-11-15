import type { ISpreadsheetLoaderDriver } from '@adapter/spi/drivers/SpreadsheetLoaderSpi'
import { XlsxDriver } from './XlsxDriver'

export class SpreadsheetLoaderDriver implements ISpreadsheetLoaderDriver {
  fromXlsxFile = async (path: string) => {
    const spreadsheet = new XlsxDriver()
    await spreadsheet.loadFile(path)
    return spreadsheet
  }

  fromXlsxBuffer = async (buffer: Buffer) => {
    const spreadsheet = new XlsxDriver()
    await spreadsheet.loadBuffer(buffer)
    return spreadsheet
  }
}
