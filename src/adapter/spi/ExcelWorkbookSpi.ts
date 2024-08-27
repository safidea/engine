import type { Spi, Cell } from '@domain/services/ExcelWorkbook'

export interface Driver {
  readTextCells: () => Cell[]
  writeCells: (cells: Cell[]) => void
  buffer: () => Promise<Buffer>
}

export class ExcelWorkbookSpi implements Spi {
  constructor(private _driver: Driver) {}

  readTextCells = (): Cell[] => {
    return this._driver.readTextCells()
  }

  writeCells = (cells: Cell[]): void => {
    this._driver.writeCells(cells)
  }

  buffer = async (): Promise<Buffer> => {
    return this._driver.buffer()
  }
}
