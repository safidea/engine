import type { Server } from '@domain/services/Server'
import type { GetRequest } from '@domain/entities/Request/Get'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Storage } from '@domain/services/Storage'
import type { StorageBucket } from '@domain/services/StorageBucket'
import { JsonResponse } from '../Response/Json'
import { DocxResponse } from '../Response/Docx'
import { XlsxResponse } from '../Response/Xlsx'
import type { FileJson } from '../File/base'
import { CreatedFile, type CreatedFileConfig } from '../File/Created'
import { PngResponse } from '../Response/Png'
import { PdfResponse } from '../Response/Pdf'

export interface BucketConfig {
  name: string
}

export interface BucketServices {
  server: Server
  storage: Storage
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export class Bucket {
  name: string
  path: string
  filePath: string
  storage: StorageBucket

  constructor(
    _config: BucketConfig,
    private _services: BucketServices
  ) {
    this.name = _config.name
    this.path = `/api/bucket/${this.name}`
    this.filePath = `${this.path}/:id`
    this.storage = _services.storage.bucket(this.name)
  }

  init = async () => {
    const { server } = this._services
    await Promise.all([server.get(this.filePath, this.get)])
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  save = async (createdFileConfig: CreatedFileConfig) => {
    const createdFile = new CreatedFile(createdFileConfig, this._services)
    const file = await this.storage.save(createdFile)
    const url = `${this._services.server.baseUrl}${this.path}/${file.id}`
    return { ...file.toJson(), url }
  }

  readById = async (id: string): Promise<FileJson | undefined> => {
    const file = await this.storage.readById(id)
    return file ? file.toJson() : undefined
  }

  get = async (request: GetRequest) => {
    const id = request.getParamOrThrow('id')
    const file = await this.storage.readById(id)
    if (!file) return new JsonResponse({ status: 404, data: { message: 'file not found' } })
    if (file.name.includes('.docx')) return new DocxResponse(file.name, file.data)
    if (file.name.includes('.xlsx')) return new XlsxResponse(file.name, file.data)
    if (file.name.includes('.jpg') || file.name.includes('.jpeg'))
      return new PngResponse(file.name, file.data)
    if (file.name.includes('.png')) return new PngResponse(file.name, file.data)
    if (file.name.includes('.pdf')) return new PdfResponse(file.name, file.data)
    return new JsonResponse({
      status: 404,
      data: { message: `can not return a ${file.name.split('.').pop()} file` },
    })
  }
}
