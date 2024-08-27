import type { Driver } from '@adapter/spi/ExcelSpi'
import { ExcelWorkbookDriver } from './ExcelWorkbookDriver'
import ExcelJS from 'exceljs'

export class ExcelDriver implements Driver {
  workbookFromFile = async (path: string): Promise<ExcelWorkbookDriver> => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(path)
    return new ExcelWorkbookDriver(workbook)
  }

  workbookFromBuffer = async (buffer: Buffer): Promise<ExcelWorkbookDriver> => {
    const workbook = new ExcelJS.Workbook()
    // eslint-disable-next-line
    // @ts-ignore
    await workbook.xlsx.load(buffer)
    return new ExcelWorkbookDriver(workbook)
  }
}
