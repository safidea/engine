import type { DatabaseTable } from '@domain/services/DatabaseTable'
import { JsonServerResponse } from '@domain/services/response/JsonServerResponse'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Logger } from '@domain/services/Logger'
import type { Field } from './fields'
import type { Engine, EngineParams } from '../Engine'
import type { ToCreateRecordData } from '@domain/services/record/ToCreateRecord'

export interface TableConfig {
  name: string
  fields: Field[]
}

export interface TableParams extends EngineParams {
  server: Server
  database: Database
  logger: Logger
}

export class Table implements Engine {
  private database: DatabaseTable

  constructor(
    private config: TableConfig,
    private params: TableParams
  ) {
    const { database, logger } = params
    this.database = database.table(this.name)
    logger.log(`POST mounted on ${this.path}`)
  }

  get name() {
    return this.config.name
  }

  get fields() {
    return this.config.fields
  }

  get path() {
    return `/api/table/${this.name}`
  }

  post = async ({ body }: { body: unknown }) => {
    // TODO: validate body
    const toCreateRecord = this.params.services.record().create(body as ToCreateRecordData)
    const persistedRecord = await this.database.insert(toCreateRecord)
    return new JsonServerResponse({ record: persistedRecord.data })
  }

  validateConfig() {
    return []
  }
}
