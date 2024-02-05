import { KyselyDatabaseDriver } from '@infrastructure/drivers/KyselyDatabaseDriver'
import { nanoid } from 'nanoid'
import { join } from 'path'
import fs from 'fs-extra'

export class Database extends KyselyDatabaseDriver {
  constructor() {
    const url = join(process.cwd(), 'tmp', nanoid(), 'database.db')
    fs.ensureFileSync(url)
    super(url)
  }
}
