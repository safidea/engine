import type { Driver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import pg from 'pg'
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { DatabaseTableDriver, type Schema } from './DatabaseTableDriver'
import type { Params } from '@domain/services/Database'

export class DatabaseDriver implements Driver {
  private kysely: Kysely<Schema>

  constructor(public params: Params) {
    const { db, url } = params
    if (db === 'sqlite') {
      const dialect = new SqliteDialect({
        database: new SQLite(url, { fileMustExist: true }),
      })
      this.kysely = new Kysely<Schema>({ dialect })
    } else if (db === 'postgres') {
      const { Pool } = pg
      const dialect = new PostgresDialect({
        pool: new Pool({
          connectionString: url,
        }),
      })
      this.kysely = new Kysely<Schema>({ dialect })
    } else throw new Error(`Database ${db} not supported`)
  }

  disconnect = async (): Promise<void> => {
    await this.kysely.destroy()
  }

  table = (name: string) => {
    return new DatabaseTableDriver(name, this.kysely, this.params.db)
  }
}
