import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Field } from './field'
import type { Base } from '../base'
import type { Record } from '@domain/entities/record'
import type { Data as ToCreateData } from '@domain/entities/record/ToCreate'
import { Json } from '@domain/entities/response/Json'
import type { Post } from '../../entities/request/Post'

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
    const { database, server } = params
    this.database = database.table(this.name)
    server.post(this.path, this.post)
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

  post = async ({ body }: Post) => {
    // TODO: validate body
    const toCreateRecord = this.params.record.create(body as ToCreateData)
    const persistedRecord = await this.database.insert(toCreateRecord)
    return new Json({ record: persistedRecord.data })
  }

  validateConfig() {
    return []
  }
}
