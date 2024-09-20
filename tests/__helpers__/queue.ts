import { QueueDriver } from '@infrastructure/drivers/QueueDriver'
import Logger from './logger'
import Database from './database'

export default class extends QueueDriver {
  constructor(database: Database) {
    const logger = new Logger()
    logger.debug(`connecting test queue to database...`)
    super(database)
    logger.debug(`test queue connected to database`)
  }
}
