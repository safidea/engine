import type { Spi, Cell } from '@domain/services/Spreadsheet'

export interface Driver {
  readTextCells: () => Cell[]
  writeCells: (cells: Cell[]) => void
  toBuffer: () => Promise<Buffer>
}

export class SpreadsheetSpi implements Spi {
  constructor(private _driver: Driver) {}

  readTextCells = (): Cell[] => {
    return this._driver.readTextCells()
  }

  writeCells = (cells: Cell[]): void => {
    this._driver.writeCells(cells)
  }

  toBuffer = async (): Promise<Buffer> => {
    return this._driver.toBuffer()
  }
}
