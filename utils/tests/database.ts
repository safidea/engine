import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'

export default class extends DatabaseDriver {
  public url: string
  public database: 'sqlite'

  constructor() {
    const database = 'sqlite'
    const url = join(process.cwd(), 'tmp', nanoid(), 'database.db')
    fs.ensureFileSync(url)
    const logger = new Logger('database')
    logger.log(`create sqlite database at ${url}`)
    super({ url, database, logger })
    this.url = url
    this.database = database
  }
}
