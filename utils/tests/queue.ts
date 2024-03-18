import { QueueDriver } from '@infrastructure/drivers/QueueDriver'
import DatabaseDriver from './database'
import Logger from './logger'
import { Database } from '@domain/services/Database'
import { DatabaseSpi } from '@adapter/spi/DatabaseSpi'

export default class extends QueueDriver {
  constructor(database: DatabaseDriver) {
    const logger = new Logger('queue')
    logger.log(`connecting queue to database...`)
    super({ database: new Database(new DatabaseSpi(database)), logger })
    logger.log(`queue connected to database`)
  }
}
