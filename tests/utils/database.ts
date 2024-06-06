import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'
import Logger from './logger'
import { DatabaseDriver } from '@infrastructure/drivers/DatabaseDriver'

export default class extends DatabaseDriver {
  constructor(type: 'sqlite' | 'postgres' = 'sqlite', url?: string) {
    const logger = new Logger('database')
    if (!url) {
      if (type === 'sqlite') {
        const path = join('tmp', nanoid(), 'database.db')
        url = join(process.cwd(), path)
        fs.ensureFileSync(url)
      } else {
        throw new Error('postgres url is required')
      }
    }
    logger.log(`connecting to ${type} database at ${url}`)
    super({ url, type, logger })
  }

  get url() {
    return this.params.url
  }

  get type() {
    return this.params.type
  }

  get config() {
    return {
      url: this.url,
      type: this.type,
    }
  }
}
