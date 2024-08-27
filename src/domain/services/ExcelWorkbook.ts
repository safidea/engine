export interface Cell {
  worksheet: string
  row: string
  column: string
  value: string | string[]
}

export interface Spi {
  readTextCells: () => Cell[]
  writeCells: (cells: Cell[]) => void
  buffer: () => Promise<Buffer>
}

export class ExcelWorkbook {
  constructor(private _spi: Spi) {}

  readTextCells = (): Cell[] => {
    return this._spi.readTextCells()
  }

  writeCells = (cells: Cell[]): void => {
    this._spi.writeCells(cells)
  }

  buffer = async (): Promise<Buffer> => {
    return this._spi.buffer()
  }
}
