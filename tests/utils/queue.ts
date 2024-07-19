import { QueueDriver } from '@infrastructure/drivers/QueueDriver'
import DatabaseDriver from './database'
import Logger from './logger'

export default class extends QueueDriver {
  constructor(database: DatabaseDriver) {
    const logger = new Logger()
    const log = logger.init('[test]:queue')
    log(`connecting queue to database...`)
    super(database.config)
    log(`queue connected to database`)
  }
}
