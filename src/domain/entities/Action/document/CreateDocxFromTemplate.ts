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
import type { DocumentLoader } from '@domain/services/DocumentLoader'
import type { Document } from '@domain/services/Document'
import { CreatedFile } from '@domain/entities/File/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { FileSystem } from '@domain/services/FileSystem'
import type { FileJson } from '@domain/entities/File/base'

export interface CreateDocxFromTemplateDocumentActionConfig extends BaseActionConfig {
  input: TemplateObject
  templatePath: string
  fileName: string
  bucket: string
}

export interface CreateDocxFromTemplateDocumentActionServices extends BaseActionServices {
  documentLoader: DocumentLoader
  templateCompiler: TemplateCompiler
  idGenerator: IdGenerator
  fileSystem: FileSystem
}

export interface CreateDocxFromTemplateDocumentActionEntities {
  buckets: Bucket[]
}

type Input = { data: TemplateObjectFilled; fileName: string }
type Output = { file: FileJson }

export class CreateDocxFromTemplateDocumentAction extends BaseAction<Input, Output> {
  private _bucket: Bucket
  private _document?: Document
  private _fileName: Template
  private _input: TemplateObjectCompiled

  constructor(
    private _config: CreateDocxFromTemplateDocumentActionConfig,
    private _services: CreateDocxFromTemplateDocumentActionServices,
    entities: CreateDocxFromTemplateDocumentActionEntities
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
    this._input = templateCompiler.compileObject(input)
    this._fileName = templateCompiler.compile(fileName)
  }

  init = async () => {
    const { templatePath } = this._config
    const { documentLoader, logger } = this._services
    this._document = await documentLoader.fromDocxFile(templatePath)
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
    if (!this._document) throw new Error('document not initialized')
    this._document.fill(input.data)
    const data = this._document.toBuffer()
    const name = fileName.includes('.docx') ? fileName : `${fileName}.docx`
    const file = new CreatedFile({ name, data }, { idGenerator })
    await this._bucket.storage.save(file)
    return { file: file.toJson() }
  }
}
