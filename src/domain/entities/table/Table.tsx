import type { IEntity } from '../IEntity'
import type { TableDto } from './TableDto'
import type { TableParams } from './TableParams'
import type { DatabaseTable } from '@domain/services/database/table/DatabaseTable'
import type { RecordToCreateDto } from '../../services/record/toCreate/RecordToCreateDto'
import { JsonServerResponse } from '@domain/services/server/response/json'

export class Table implements IEntity {
  private database: DatabaseTable

  constructor(
    private config: TableDto,
    private params: TableParams
  ) {
    const { server, database, logger } = params
    server.post(this.path, this.post)
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
    const recordToCreate = this.params.services.record().create(body as RecordToCreateDto)
    const persistedRecord = await this.database.insert(recordToCreate)
    return new JsonServerResponse({ record: persistedRecord.dto })
  }

  validateConfig() {
    return []
  }
}
