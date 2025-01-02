import { StorageDriver } from '@infrastructure/drivers/shared/StorageDriver'
import Logger from './logger'
import Database from './database'

export default class extends StorageDriver {
  constructor(database: Database) {
    const logger = new Logger()
    logger.debug(`connecting test storage to database...`)
    super(database)
    logger.debug(`test storage connected to database`)
  }
}
