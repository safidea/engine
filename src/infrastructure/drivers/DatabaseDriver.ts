import type { Driver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import pg from 'pg'
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { DatabaseTableDriver, type Schema } from './DatabaseTableDriver'
import type { Params } from '@domain/services/Database'

export class DatabaseDriver implements Driver {
  private db: Kysely<Schema>

  constructor(public params: Params) {
    const { database, url } = params
    if (database === 'sqlite') {
      const dialect = new SqliteDialect({
        database: new SQLite(url, { fileMustExist: true }),
      })
      this.db = new Kysely<Schema>({ dialect })
    } else if (database === 'postgres') {
      const { Pool } = pg
      const dialect = new PostgresDialect({
        pool: new Pool({
          connectionString: url,
        }),
      })
      this.db = new Kysely<Schema>({ dialect })
    } else throw new Error(`Database ${database} not supported`)
  }

  disconnect = async (): Promise<void> => {
    await this.db.destroy()
  }

  table = (name: string) => {
    return new DatabaseTableDriver(name, this.db, this.params.database)
  }
}
