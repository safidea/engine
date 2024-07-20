import { QueueDriver } from '@infrastructure/drivers/QueueDriver'
import Logger from './logger'
import Database from './database'

export default class extends QueueDriver {
  constructor(database: Database) {
    const logger = new Logger()
    const log = logger.init('[test]:queue')
    log(`connecting queue to database...`)
    super(database)
    log(`queue connected to database`)
  }
}
