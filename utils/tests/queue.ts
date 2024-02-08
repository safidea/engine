import { QueueDriver } from '@infrastructure/drivers/QueueDriver'
import Database from './database'
import Logger from './logger'

export default class extends QueueDriver {
  constructor({ url, database }: Database) {
    const logger = new Logger('queue')
    logger.log(`connect queue to database`)
    super({ url, database, logger })
  }
}
