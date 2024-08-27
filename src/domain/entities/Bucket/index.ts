import type { Server } from '@domain/services/Server'
import type { Data as PersistedData } from '@domain/entities/File/Persisted'
import type { Get } from '@domain/entities/Request/Get'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Storage } from '@domain/services/Storage'
import type { StorageBucket } from '@domain/services/StorageBucket'
import { File } from '@domain/entities/File'
import { Json } from '../Response/Json'
import { Docx } from '../Response/Docx'
import { Xlsx } from '../Response/Xlsx'

interface Params {
  name: string
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

  constructor(private _params: Params) {
    const { storage, name } = _params
    this.name = name
    this.path = `/api/bucket/${this.name}`
    this.filePath = `${this.path}/:id`
    this.storage = storage.bucket(this.name)
  }

  get file() {
    const { idGenerator, templateCompiler, server } = this._params
    return new File({ idGenerator, templateCompiler, server })
  }

  init = async () => {
    const { server } = this._params
    await Promise.all([server.get(this.filePath, this.get)])
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  readById = async (id: string): Promise<PersistedData | undefined> => {
    const file = await this.storage.readById(id)
    return file ? file.data : undefined
  }

  get = async (request: Get) => {
    const id = request.getParamOrThrow('id')
    const file = await this.readById(id)
    if (!file) return new Json({ status: 404, data: { message: 'file not found' } })
    if (file.name.includes('.docx')) return new Docx(file.name, file.file_data)
    if (file.name.includes('.xlsx')) return new Xlsx(file.name, file.file_data)
    return new Json({
      status: 404,
      data: { message: `can not return a ${file.name.split('.').pop()} file` },
    })
  }
}
