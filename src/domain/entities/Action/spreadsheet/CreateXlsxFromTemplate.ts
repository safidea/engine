import { BaseAction, type BaseActionConfig, type BaseActionServices } from '../base'
import type { AutomationContext } from '../../Automation/Context'
import {
  Template,
  type TemplateObject,
  type TemplateObjectCompiled,
  type TemplateObjectFilled,
} from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Bucket } from '@domain/entities/Bucket'
import type { Spreadsheet } from '@domain/services/Spreadsheet'
import type { SpreadsheetLoader } from '@domain/services/SpreadsheetLoader'
import { CreatedFile } from '@domain/entities/File/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { FileSystem } from '@domain/services/FileSystem'
import type { FileJson } from '@domain/entities/File/base'

export interface CreateXlsxFromTemplateSpreadsheetActionConfig extends BaseActionConfig {
  input?: TemplateObject
  templatePath: string
  fileName: string
  bucket: string
}

export interface CreateXlsxFromTemplateSpreadsheetActionServices extends BaseActionServices {
  idGenerator: IdGenerator
  spreadsheetLoader: SpreadsheetLoader
  templateCompiler: TemplateCompiler
  fileSystem: FileSystem
}

export interface CreateXlsxFromTemplateSpreadsheetActionEntities {
  buckets: Bucket[]
}

type Input = { data: TemplateObjectFilled; fileName: string }
type Output = { file: FileJson }

export class CreateXlsxFromTemplateSpreadsheetAction extends BaseAction<Input, Output> {
  private _fileName: Template
  private _spreadsheet?: Spreadsheet
  private _input: TemplateObjectCompiled
  private _bucket: Bucket

  constructor(
    private _config: CreateXlsxFromTemplateSpreadsheetActionConfig,
    private _services: CreateXlsxFromTemplateSpreadsheetActionServices,
    entities: CreateXlsxFromTemplateSpreadsheetActionEntities
  ) {
    super(_config, _services)
    const { templatePath, input, fileName, bucket: bucketName } = _config
    const { templateCompiler, fileSystem } = _services
    const { buckets } = entities
    if (!templatePath.endsWith('.xlsx'))
      this._throwConfigError(`templatePath "${templatePath}" must be a .xlsx file`)
    if (!fileSystem.exists(templatePath))
      this._throwConfigError(`templatePath "${templatePath}" does not exist`)
    this._input = templateCompiler.compileObject(input ?? {})
    this._fileName = templateCompiler.compile(fileName)
    this._bucket = this._findBucketByName(bucketName, buckets)
  }

  init = async () => {
    const { spreadsheetLoader, logger } = this._services
    const { templatePath } = this._config
    this._spreadsheet = await spreadsheetLoader.fromXlsxFile(templatePath)
    logger.debug(`init action "${this.name}"`)
  }

  protected _prepare = async (context: AutomationContext) => {
    return {
      data: Template.fillObject(this._input, context.data),
      fileName: this._fileName.fill(context.data),
    }
  }

  protected _process = async (input: Input) => {
    const { idGenerator } = this._services
    const { fileName } = input
    if (!this._spreadsheet) throw new Error('CreateXlsxFromTemplate: workbook not initialized')
    this._spreadsheet.fill(input.data)
    const data = await this._spreadsheet.toBuffer()
    const name = fileName.includes('.xlsx') ? fileName : `${fileName}.xlsx`
    const file = new CreatedFile({ name, data }, { idGenerator })
    await this._bucket.storage.save(file)
    return { file: file.toJson() }
  }
}
