import type { ILoggerLog } from '@domain/drivers/ILogger'
import type { IEntity } from '../IEntity'
import type { ITable } from './ITable'
import type { ITableParams } from './ITableParams'
import { JsonServerResponse } from '@domain/drivers/server/response/json'

export class Table implements IEntity {
  name: string
  private log: ILoggerLog

  constructor(config: ITable, params: ITableParams) {
    const { featureName, drivers, serverInstance } = params
    const { logger } = drivers
    this.name = config.name
    this.log = logger.init(`feature:${logger.slug(featureName)}:table:${logger.slug(this.name)}`)
    serverInstance.post(this.path, this.post)
    this.log(`POST mounted on ${this.path}`)
  }

  get path() {
    return `/api/table/${this.name}`
  }

  post = async () => {
    this.log('POST ' + this.path)
    return new JsonServerResponse({ record: { id: 'true', name: 'John' } })
  }

  validateConfig() {
    return []
  }
}
