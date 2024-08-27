import type { Driver } from '@adapter/spi/ExcelWorkbookSpi'
import type { Cell } from '@domain/services/ExcelWorkbook'
import type ExcelJS from 'exceljs'

export class ExcelWorkbookDriver implements Driver {
  constructor(private _workbook: ExcelJS.Workbook) {}

  readTextCells = () => {
    const cells: Cell[] = []
    this._workbook.eachSheet((sheet) => {
      sheet.eachRow((row) => {
        row.eachCell((rowCell) => {
          if (
            !!rowCell.value &&
            (typeof rowCell.value === 'string' ||
              (typeof rowCell.value === 'object' && 'richText' in rowCell.value))
          ) {
            const cell: Cell = {
              worksheet: sheet.name,
              row: rowCell.row,
              column: rowCell.col,
              value: '',
            }
            if (typeof rowCell.value === 'string') {
              cell.value = rowCell.value
            } else {
              cell.value = rowCell.value.richText.map((text) => text.text)
            }
            cells.push(cell)
          }
        })
      })
    })
    return cells
  }

  writeCells = (cells: Cell[]) => {
    cells.forEach((cell) => {
      const worksheet = this._workbook.getWorksheet(cell.worksheet)
      if (!worksheet) {
        throw new Error(`Worksheet "${cell.worksheet}" not found`)
      }
      const value = worksheet.getCell(cell.row, cell.column).value
      if (
        !!value &&
        typeof value === 'object' &&
        'richText' in value &&
        Array.isArray(cell.value)
      ) {
        const { richText } = value
        worksheet.getCell(cell.row, cell.column).value = {
          richText: richText.map((text: ExcelJS.RichText, index) => {
            if (cell.value[index]) {
              return { ...text, text: cell.value[index] }
            }
            return text
          }),
        }
      } else if (!Array.isArray(cell.value)) {
        worksheet.getCell(cell.row, cell.column).value = cell.value
      }
    })
  }

  buffer = async () => {
    const buffer = await this._workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
  }
}
