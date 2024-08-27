import { Base, type Params as BaseParams, type Interface } from '../base'
import type { Context } from '../../Automation/Context'
import { Template, type OutputFormat, type OutputParser } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { ConfigError } from '@domain/entities/Error/Config'
import type { Bucket } from '@domain/entities/Bucket'
import type { Excel } from '@domain/services/Excel'
import type { ExcelWorkbook } from '@domain/services/ExcelWorkbook'

interface Params extends BaseParams {
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  templatePath: string
  templateCompiler: TemplateCompiler
  fileName: string
  bucket: Bucket
  excel: Excel
}

export class CreateXlsxFromTemplate extends Base implements Interface {
  private _workbook?: ExcelWorkbook
  private _cells: {
    worksheet: string
    row: string
    column: string
    value: Template | Template[]
  }[] = []
  private _input: { [key: string]: Template }

  constructor(private _params: Params) {
    super(_params)
    const { templateCompiler, templatePath, input } = _params
    if (!templatePath.endsWith('.xlsx'))
      throw new ConfigError({ message: 'CreateFromTemplate: templatePath must be a .xlsx file' })
    this._input = Object.entries(input ?? {}).reduce(
      (acc: { [key: string]: Template }, [key, { value, type }]) => {
        acc[key] = templateCompiler.compile(value, type)
        return acc
      },
      {}
    )
  }

  init = async () => {
    const { excel, templateCompiler, templatePath } = this._params
    this._workbook = await excel.workbookFromFile(templatePath)
    const cells = this._workbook.readTextCells()
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

  execute = async (context: Context) => {
    if (!this._workbook) throw new Error('CreateXlsxFromTemplate: workbook not initialized')
    const { fileName, bucket } = this._params
    const data = Object.entries(this._input).reduce(
      (acc: { [key: string]: OutputFormat }, [key, value]) => {
        acc[key] = context.fillTemplate(value)
        return acc
      },
      {}
    )
    try {
      const cells = this._cells.map(({ worksheet, row, column, value }) => ({
        worksheet,
        row,
        column,
        value: Array.isArray(value)
          ? value.map((v) => v.fillAsString(data))
          : value.fillAsString(data),
      }))
      this._workbook.writeCells(cells)
      const fileData = await this._workbook.buffer()
      const fileToSave = bucket.file
        .toSave({ name: fileName, file_data: fileData })
        .fillWithContext(context)
      await bucket.storage.save(fileToSave)
      context.set(this.name, { fileId: fileToSave.id })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`CreateFromTemplate: ${error.message}`)
      }
      console.error(error)
      throw new Error(`CreateFromTemplate: unknown error`)
    }
  }
}
