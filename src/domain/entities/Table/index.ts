import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Field } from '../Field'
import { Record } from '@domain/entities/Record'
import type { Data as ToCreateData } from '@domain/entities/Record/ToCreate'
import type { Data as ToUpdateData } from '@domain/entities/Record/ToUpdate'
import { Json } from '@domain/entities/Response/Json'
import type { Post } from '@domain/entities/Request/Post'
import type { Patch } from '@domain/entities/Request/Patch'
import type { Get } from '@domain/entities/Request/Get'
import { Is } from '@domain/entities/Filter/Is'
import type { Delete } from '@domain/entities/Request/Delete'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { IdGenerator } from '@domain/services/IdGenerator'

interface Params {
  name: string
  fields: Field[]
  server: Server
  database: Database
  logger: Logger
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
}

export class Table {
  private database: DatabaseTable

  constructor(private params: Params) {
    const { database } = params
    this.database = database.table(this.name)
  }

  init = async () => {
    const { server } = this.params
    await Promise.all([
      server.post(this.path, this.post),
      server.get(this.path, this.getAll),
      server.get(this.recordPath, this.get),
      server.patch(this.recordPath, this.patch),
      server.delete(this.recordPath, this.delete),
    ])
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  get name() {
    return this.params.name
  }

  get fields() {
    return this.params.fields
  }

  get path() {
    return `/api/table/${this.name}`
  }

  get recordPath() {
    return `${this.path}/:id`
  }

  newRecord = () => {
    const { idGenerator, templateCompiler } = this.params
    return new Record({ idGenerator, templateCompiler })
  }

  post = async (request: Post) => {
    // TODO: validate body
    const toCreateRecord = this.newRecord().create(request.body as ToCreateData)
    const persistedRecord = await this.database.insert(toCreateRecord)
    return new Json({ record: persistedRecord.data })
  }

  patch = async (request: Patch) => {
    // TODO: validate body
    const id = request.getParamOrThrow('id')
    const toUpdateRecord = this.newRecord().update({
      id,
      ...(request.body as object),
    } as ToUpdateData)
    const persistedRecord = await this.database.update(toUpdateRecord)
    return new Json({ record: persistedRecord.data })
  }

  get = async (request: Get) => {
    const id = request.getParamOrThrow('id')
    const record = await this.database.read([new Is({ field: 'id', value: id })])
    if (!record) {
      return new Json({ record: null })
    }
    return new Json({ record: record.data })
  }

  getAll = async () => {
    const records = await this.database.list([])
    return new Json({ records: records.map((record) => record.data) })
  }

  delete = async (request: Delete) => {
    const id = request.getParamOrThrow('id')
    await this.database.delete([new Is({ field: 'id', value: id })])
    return new Json({ id })
  }
}
