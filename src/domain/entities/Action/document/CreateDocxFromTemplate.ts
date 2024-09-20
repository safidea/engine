import { Base, type BaseConfig, type BaseServices } from '../base'
import type { Context } from '../../Automation/Context'
import { Template, type InputValues, type OutputValue } from '@domain/services/Template'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Bucket } from '@domain/entities/Bucket'
import type { DocumentLoader } from '@domain/services/DocumentLoader'
import type { Document } from '@domain/services/Document'
import { CreatedFile } from '@domain/entities/File/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { FileSystem } from '@domain/services/FileSystem'
import type { FileJson } from '@domain/entities/File/base'

export interface Config extends BaseConfig {
  input: InputValues
  templatePath: string
  fileName: string
  bucket: string
}

export interface Services extends BaseServices {
  documentLoader: DocumentLoader
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
  fileSystem: FileSystem
}

export interface Entities {
  buckets: Bucket[]
}

type Input = { data: { [key: string]: OutputValue }; fileName: string }
type Output = { file: FileJson }

export class CreateDocxFromTemplate extends Base<Input, Output> {
  private _bucket: Bucket
  private _document?: Document
  private _fileName: Template
  private _input: { [key: string]: Template }

  constructor(
    private _config: Config,
    private _services: Services,
    entities: Entities
  ) {
    super(_config, _services)
    const { input, templatePath, fileName, bucket: bucketName } = _config
    const { templateCompiler, fileSystem } = _services
    const { buckets } = entities
    if (!templatePath.endsWith('.docx'))
      this._throwConfigError(`templatePath "${templatePath}" must be a .docx file`)
    if (!fileSystem.exists(templatePath))
      this._throwConfigError(`templatePath "${templatePath}" does not exist`)
    this._bucket = this._findBucketByName(bucketName, buckets)
    this._input = templateCompiler.compileObjectWithType(input)
    this._fileName = templateCompiler.compile(fileName)
  }

  init = async () => {
    const { templatePath } = this._config
    const { documentLoader, logger } = this._services
    this._document = await documentLoader.fromDocxFile(templatePath)
    logger.debug(`init action "${this.name}"`)
  }

  protected _prepare = async (context: Context) => {
    return {
      data: context.fillObjectTemplate(this._input),
      fileName: context.fillTemplateAsString(this._fileName),
    }
  }

  protected _process = async (input: Input) => {
    const { idGenerator } = this._services
    const { fileName } = input
    if (!this._document) throw new Error('document not initialized')
    this._document.fill(input.data)
    const data = this._document.toBuffer()
    const name = fileName.includes('.docx') ? fileName : `${fileName}.docx`
    const file = new CreatedFile({ name, data }, { idGenerator })
    await this._bucket.storage.save(file)
    return { file: file.toJson() }
  }
}
