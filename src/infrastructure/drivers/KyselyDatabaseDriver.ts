import type { DatabaseDriver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import pg from 'pg'
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { KyselyDatabaseTable, type Database } from './KyselyDatabaseTableDriver'

export class KyselyDatabaseDriver implements DatabaseDriver {
  private db: Kysely<Database>

  constructor(
    public url: string = ':memory:',
    public database: 'sqlite' | 'postgres' = 'sqlite'
  ) {
    if (database === 'sqlite') {
      const dialect = new SqliteDialect({
        database: new SQLite(url, { fileMustExist: true }),
      })
      this.db = new Kysely<Database>({ dialect })
    } else if (database === 'postgres') {
      const { Pool } = pg
      const dialect = new PostgresDialect({
        pool: new Pool({
          connectionString: url,
        }),
      })
      this.db = new Kysely<Database>({ dialect })
    } else throw new Error(`Database ${database} not supported`)
  }

  async disconnect(): Promise<void> {
    await this.db.destroy()
  }

  table(name: string) {
    return new KyselyDatabaseTable(name, this.db, this.database)
  }
}
