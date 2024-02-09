import { QueueDriver } from '@infrastructure/drivers/QueueDriver'
import Database from './database'
import Logger from './logger'

export default class extends QueueDriver {
  constructor({ url, database }: Database) {
    const logger = new Logger('queue')
    logger.log(`connecting queue to database...`)
    super({ url, database, logger })
    logger.log(`queue connected to database`)
  }
}
