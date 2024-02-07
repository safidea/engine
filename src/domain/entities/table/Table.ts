import type { DatabaseTable } from '@domain/services/DatabaseTable'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Field } from './Field'
import type { Engine } from '../Engine'
import type { Record } from '@domain/services/Record'
import type { ToCreateData } from '@domain/services/Record/ToCreate'
import { Json } from '@domain/services/Response/Json'

interface Params {
  name: string
  fields: Field[]
  server: Server
  database: Database
  logger: Logger
  record: Record
}

export class Table implements Engine {
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

  post = async ({ body }: { body: unknown }) => {
    // TODO: validate body
    this.params.logger.log(`POST ${this.path}: ${JSON.stringify(body, null, 2)}`)
    const toCreateRecord = this.params.record.create(body as ToCreateData)
    const persistedRecord = await this.database.insert(toCreateRecord)
    return new Json({ record: persistedRecord.data })
  }

  validateConfig() {
    return []
  }
}
