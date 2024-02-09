import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'

export default class extends DatabaseDriver {
  public url: string
  public database: 'sqlite'

  constructor() {
    const logger = new Logger('database')
    logger.log(`creating sqlite database...`)
    const database = 'sqlite'
    const path = join('tmp', nanoid(), 'database.db')
    const url = join(process.cwd(), path)
    fs.ensureFileSync(url)
    super({ url, database, logger })
    this.url = url
    this.database = database
    logger.log(`sqlite database created at /${path}`)
  }
}
