import type { Template } from './Template'
import type { TemplateCompiler } from './TemplateCompiler'

export interface Cell {
  worksheet: string
  row: string
  column: string
  value: string | string[]
}

export interface CellTemplate extends Omit<Cell, 'value'> {
  value: Template | Template[]
}

export interface Spi {
  readTextCells: () => Cell[]
  writeCells: (cells: Cell[]) => void
  toBuffer: () => Promise<Buffer>
}

export interface Services {
  templateCompiler: TemplateCompiler
}

export class Spreadsheet {
  private _cells: CellTemplate[] = []

  constructor(
    private _spi: Spi,
    services: Services
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

  fill = (data: Record<string, unknown>) => {
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
