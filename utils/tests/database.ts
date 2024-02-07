import { KyselyDatabaseDriver } from '@infrastructure/drivers/KyselyDatabaseDriver'
import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'

export default class extends KyselyDatabaseDriver {
  public url: string

  constructor() {
    const url = join(process.cwd(), 'tmp', nanoid(), 'database.db')
    fs.ensureFileSync(url)
    const logger = new Logger('database')
    logger.log(`create sqlite database at ${url}`)
    super({ url, database: 'sqlite', logger })
    this.url = url
  }
}
