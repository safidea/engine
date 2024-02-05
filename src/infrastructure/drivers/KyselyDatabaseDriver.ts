import type { DatabaseDriver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import { KyselyDatabaseTable, type Database } from './KyselyDatabaseTableDriver'

export class KyselyDatabaseDriver implements DatabaseDriver {
  private db: Kysely<Database>

  constructor(public url = ':memory:') {
    const dialect = new SqliteDialect({
      database: new SQLite(url, { fileMustExist: true }),
    })
    this.db = new Kysely<Database>({ dialect })
  }

  async disconnect(): Promise<void> {
    await this.db.destroy()
  }

  table(name: string) {
    return new KyselyDatabaseTable(name, this.db)
  }
}
