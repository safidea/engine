import { Base, type BaseConfig } from '../base'
import type { Context } from '../../Automation/Context'
import { Template, type InputValues } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Bucket } from '@domain/entities/Bucket'
import type { Spreadsheet } from '@domain/services/Spreadsheet'
import type { SpreadsheetLoader } from '@domain/services/SpreadsheetLoader'
import { CreatedFile } from '@domain/entities/File/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { FileSystem } from '@domain/services/FileSystem'

export interface Config extends BaseConfig {
  input?: InputValues
  templatePath: string
  fileName: string
  bucket: string
}

export interface Services {
  idGenerator: IdGenerator
  spreadsheetLoader: SpreadsheetLoader
  templateCompiler: TemplateCompiler
  fileSystem: FileSystem
}

export interface Entities {
  buckets: Bucket[]
}

export class CreateXlsxFromTemplate extends Base {
  private _fileName: Template
  private _spreadsheet?: Spreadsheet
  private _input: { [key: string]: Template }
  private _bucket: Bucket

  constructor(
    private _config: Config,
    private _services: Services,
    entities: Entities
  ) {
    super(_config)
    const { templatePath, input, fileName, bucket: bucketName } = _config
    const { templateCompiler, fileSystem } = _services
    const { buckets } = entities
    if (!templatePath.endsWith('.xlsx'))
      this._throwConfigError(`templatePath "${templatePath}" must be a .xlsx file`)
    if (!fileSystem.exists(templatePath))
      this._throwConfigError(`templatePath "${templatePath}" does not exist`)
    this._input = templateCompiler.compileObjectWithType(input ?? {})
    this._fileName = templateCompiler.compile(fileName)
    this._bucket = this._findBucketByName(bucketName, buckets)
  }

  init = async () => {
    const { spreadsheetLoader } = this._services
    const { templatePath } = this._config
    this._spreadsheet = await spreadsheetLoader.fromXlsxFile(templatePath)
  }

  execute = async (context: Context) => {
    const { idGenerator } = this._services
    if (!this._spreadsheet) throw new Error('CreateXlsxFromTemplate: workbook not initialized')
    this._spreadsheet.fill(context.fillObjectTemplate(this._input))
    const data = await this._spreadsheet.toBuffer()
    const fileName = context.fillTemplateAsString(this._fileName)
    const name = fileName.includes('.xlsx') ? fileName : `${fileName}.xlsx`
    const file = new CreatedFile({ name, data }, { idGenerator })
    await this._bucket.storage.save(file)
    context.set(this.name, { file: file.toJson() })
  }
}
