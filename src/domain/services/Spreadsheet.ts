import type { Template } from './Template'
import type { TemplateCompiler } from './TemplateCompiler'

export interface SpreadsheetCell {
  worksheet: string
  row: string
  column: string
  value: string | string[]
}

export interface SpreadsheetCellTemplate extends Omit<SpreadsheetCell, 'value'> {
  value: Template | Template[]
}

export interface ISpreadsheetSpi {
  readTextCells: () => SpreadsheetCell[]
  writeCells: (cells: SpreadsheetCell[]) => void
  toBuffer: () => Promise<Buffer>
}

export interface SpreadsheetServices {
  templateCompiler: TemplateCompiler
}

export class Spreadsheet {
  private _cells: SpreadsheetCellTemplate[] = []

  constructor(
    private _spi: ISpreadsheetSpi,
    services: SpreadsheetServices
  ) {
    const { templateCompiler } = services
    const cells = _spi.readTextCells()
    cells.forEach(({ worksheet, row, column, value }) => {
      this._cells.push({
        worksheet,
        row,
        column,
        value: Array.isArray(value)
          ? value.map((v) => templateCompiler.compile(v))
          : templateCompiler.compile(value),
      })
    })
  }

  fill = (data: { [key: string]: unknown }) => {
    const cells = this._cells.map((cell) => {
      const filledValue = Array.isArray(cell.value)
        ? cell.value.map((v) => v.fillAsString(data))
        : cell.value.fillAsString(data)
      return { ...cell, value: filledValue }
    })
    this._spi.writeCells(cells)
  }

  toBuffer = async (): Promise<Buffer> => {
    return this._spi.toBuffer()
  }

  toHtml = (): string => {
    return this._spi
      .readTextCells()
      .map(({ worksheet, row, column, value }) => {
        const cell = `${worksheet}!${column}${row}`
        return `<tr><td>${cell}</td><td>${value}</td></tr>`
      })
      .join('')
  }
}
