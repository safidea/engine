import type { Driver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import pg from 'pg'
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { DatabaseTableDriver, type Schema } from './DatabaseTableDriver'
import type { Params } from '@domain/services/Database'

export class DatabaseDriver implements Driver {
  private kysely: Kysely<Schema>
  private database: SQLite.Database | pg.Pool
  exec: (query: string) => Promise<unknown>

  constructor(public params: Params) {
    const { db, url } = params
    if (db === 'sqlite') {
      const database = new SQLite(url)
      database.pragma('journal_mode = WAL')
      this.exec = async (query: string) => database.exec(query)
      const dialect = new SqliteDialect({ database })
      this.kysely = new Kysely<Schema>({ dialect })
      this.database = database
    } else if (db === 'postgres') {
      const pool = new pg.Pool({ connectionString: url })
      this.exec = async (query: string) => pool.query(query)
      const dialect = new PostgresDialect({ pool })
      this.kysely = new Kysely<Schema>({ dialect })
      this.database = pool
    } else throw new Error(`Database ${db} not supported`)
  }

  disconnect = async (): Promise<void> => {
    await this.kysely.destroy()
  }

  table = (name: string) => {
    return new DatabaseTableDriver(name, this.kysely, this.database)
  }
}
