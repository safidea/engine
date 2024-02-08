import { QueueDriver } from '@infrastructure/drivers/QueueDriver'
import Database from './database'

export default class extends QueueDriver {
  constructor(database: Database) {
    super(database)
  }
}
