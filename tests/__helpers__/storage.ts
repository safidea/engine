import { StorageDriver } from '@infrastructure/drivers/StorageDriver'
import Logger from './logger'
import Database from './database'

export default class extends StorageDriver {
  constructor(database: Database) {
    const logger = new Logger()
    const log = logger.init('[test]:storage')
    log(`connecting storage to database...`)
    super(database)
    log(`queue connected to database`)
  }
}
