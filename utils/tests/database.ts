import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'

export default class extends DatabaseDriver {
  public url: string
  public db: 'sqlite'

  constructor() {
    const logger = new Logger('database')
    logger.log(`creating sqlite database...`)
    const db = 'sqlite'
    const path = join('tmp', nanoid(), 'database.db')
    const url = join(process.cwd(), path)
    fs.ensureFileSync(url)
    super({ url, db, logger })
    this.url = url
    this.db = db
    logger.log(`sqlite database created at /${path}`)
  }

  get config() {
    return {
      url: this.url,
      db: this.db,
    }
  }
}
