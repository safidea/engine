import type { Driver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import pg from 'pg'
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { DatabaseTableDriver, type Schema } from './DatabaseTableDriver'
import type { Params } from '@domain/services/Database'

export class DatabaseDriver implements Driver {
  private kysely: Kysely<Schema>
  exec: (query: string) => Promise<void>

  constructor(public params: Params) {
    const { db, url } = params
    if (db === 'sqlite') {
      const database = new SQLite(url)
      const dialect = new SqliteDialect({ database })
      this.exec = async (query: string) => {
        database.exec(query)
      }
      this.kysely = new Kysely<Schema>({ dialect })
    } else if (db === 'postgres') {
      const { Pool } = pg
      const pool = new Pool({ connectionString: url })
      const dialect = new PostgresDialect({ pool })
      this.kysely = new Kysely<Schema>({ dialect })
      this.exec = async (query: string) => {
        await pool.query(query)
      }
    } else throw new Error(`Database ${db} not supported`)
  }

  disconnect = async (): Promise<void> => {
    await this.kysely.destroy()
  }

  table = (name: string) => {
    return new DatabaseTableDriver(name, this.kysely, this.params.db)
  }
}
