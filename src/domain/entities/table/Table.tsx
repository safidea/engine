import type { ILoggerLog } from '@domain/drivers/ILogger'
import type { IEntity } from '../IEntity'
import type { ITable } from './ITable'
import type { ITableParams } from './ITableParams'
import { JsonServerResponse } from '@domain/drivers/server/response/json'
import type { IDatabaseRow, IDatabaseTable } from '@domain/drivers/IDatabase'

export class Table implements IEntity {
  name: string
  private log: ILoggerLog
  private databaseTable: IDatabaseTable

  constructor(
    private config: ITable,
    params: ITableParams
  ) {
    const { featureName, drivers, serverInstance, databaseInstance } = params
    const { logger } = drivers
    this.name = config.name
    this.log = logger.init(`feature:${logger.slug(featureName)}:table:${logger.slug(this.name)}`)
    serverInstance.post(this.path, this.post)
    this.databaseTable = databaseInstance.table(this.name)
    this.log(`POST mounted on ${this.path}`)
  }

  get path() {
    return `/api/table/${this.name}`
  }

  get fields() {
    return this.config.fields
  }

  post = async ({ body }: { body: unknown }) => {
    // TODO: validate body
    const data = body as IDatabaseRow
    // TODO: generate automatic id
    const record = await this.databaseTable.insert({ id: '1234', ...data })
    return new JsonServerResponse({ record })
  }

  validateConfig() {
    return []
  }
}
