import type { ILoggerLog } from '@domain/drivers/ILogger'
import type { IEntity } from '../IEntity'
import type { ITable } from './ITable'
import type { ITableParams } from './ITableParams'

export class Table implements IEntity {
  name: string
  private log: ILoggerLog

  constructor(config: ITable, params: ITableParams) {
    const { featureName, drivers } = params
    const { logger } = drivers
    this.name = config.name
    this.log = logger.init(`feature:${logger.slug(featureName)}:table:${logger.slug(this.name)}`)
    this.log(`GET mounted on /api/table/${this.name}`)
  }

  get = async () => {
    this.log('GET /api/table/' + this.name)
  }

  validateConfig() {
    return []
  }
}
