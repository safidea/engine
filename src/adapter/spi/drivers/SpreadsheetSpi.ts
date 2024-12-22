import type { ISpreadsheetSpi, SpreadsheetCell } from '@domain/services/Spreadsheet'

export interface ISpreadsheetDriver {
  readTextCells: () => SpreadsheetCell[]
  writeCells: (cells: SpreadsheetCell[]) => void
  toBuffer: () => Promise<Buffer>
}

export class SpreadsheetSpi implements ISpreadsheetSpi {
  constructor(private _driver: ISpreadsheetDriver) {}

  readTextCells = (): SpreadsheetCell[] => {
    return this._driver.readTextCells()
  }

  writeCells = (cells: SpreadsheetCell[]): void => {
    this._driver.writeCells(cells)
  }

  toBuffer = async (): Promise<Buffer> => {
    return this._driver.toBuffer()
  }
}
