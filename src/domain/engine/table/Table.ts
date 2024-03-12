import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Field } from './field'
import type { Base } from '../base'
import type { Record } from '@domain/entities/record'
import type { Data as ToCreateData } from '@domain/entities/record/ToCreate'
import type { Data as ToUpdateData } from '@domain/entities/record/ToUpdate'
import { Json } from '@domain/entities/response/Json'
import type { Post } from '../../entities/request/Post'
import type { Patch } from '@domain/entities/request/Patch'

interface Params {
  name: string
  fields: Field[]
  server: Server
  database: Database
  logger: Logger
  record: Record
}

export class Table implements Base {
  private database: DatabaseTable

  constructor(private params: Params) {
    const { database } = params
    this.database = database.table(this.name)
  }

  init = async () => {
    const { server } = this.params
    await server.post(this.path, this.post)
    await server.patch(this.recordPath, this.patch)
    await server.get(this.path, this.getAll)
    await server.get(this.recordPath, this.get)
  }

  validateConfig = async () => {
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

  post = async (post: Post) => {
    const { record } = this.params
    // TODO: validate body
    const toCreateRecord = record.create(post.body as ToCreateData)
    const persistedRecord = await this.database.insert(toCreateRecord)
    return new Json({ record: persistedRecord.data })
  }

  patch = async (patch: Patch) => {
    const { record } = this.params
    // TODO: validate body
    const id = patch.getParamOrThrow('id')
    const toUpdateRecord = record.update({ id, ...(patch.body as object) } as ToUpdateData)
    const persistedRecord = await this.database.update(toUpdateRecord)
    return new Json({ record: persistedRecord.data })
  }

  get = async () => {
    const record = await this.database.read([])
    if (!record) {
      return new Json({ record: null })
    }
    return new Json({ record: record.data })
  }

  getAll = async () => {
    const records = await this.database.list([])
    return new Json({ records: records.map((record) => record.data) })
  }
}
