import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'

export default class extends DatabaseDriver {
  constructor(
    public type: 'sqlite' | 'postgres' = 'sqlite',
    public url = ':memory:'
  ) {
    const logger = new Logger()
    const log = logger.init('[test]:database')
    if (!url) {
      if (type === 'sqlite') {
        const path = join('tmp', nanoid(), 'database.db')
        url = join(process.cwd(), path)
        fs.ensureFileSync(url)
      } else {
        throw new Error('postgres url is required')
      }
    }
    log(`connecting to ${type} database at ${url}`)
    super({ url, type })
  }

  get config() {
    return {
      url: this.url,
      type: this.type,
    }
  }
}
