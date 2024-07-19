import type { Driver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import pg from 'pg'
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { DatabaseTableDriver, type Schema } from './DatabaseTableDriver'
import type { Config } from '@domain/services/Database'

interface Notification {
  id: number
  payload: string
  processed: number
}

export class DatabaseDriver implements Driver {
  private kysely: Kysely<Schema>
  private db: SQLite.Database | pg.Pool
  private client?: pg.Client
  private interval?: Timer
  private onNotification: ((payload: string) => void)[] = []

  constructor(config: Config) {
    const { type, url } = config
    if (type === 'sqlite') {
      const db = new SQLite(url)
      db.pragma('journal_mode = WAL')
      const dialect = new SqliteDialect({ database: db })
      this.kysely = new Kysely<Schema>({ dialect })
      this.db = db
    } else if (type === 'postgres') {
      const pool = new pg.Pool({ connectionString: url })
      const dialect = new PostgresDialect({ pool })
      this.client = new pg.Client({ connectionString: url })
      this.kysely = new Kysely<Schema>({ dialect })
      this.db = pool
    } else throw new Error(`DatabaseDriver: database "${type}" not supported`)
  }

  connect = async (): Promise<void> => {
    if (this.client) await this.client.connect()
    else if (this.db instanceof SQLite) {
      const { db } = this
      db.exec(`
        CREATE TABLE IF NOT EXISTS _notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          payload TEXT,
          processed INTEGER DEFAULT 0
        );
      `)
      const emitNotification = () => {
        const notifications = db
          .prepare('SELECT * FROM _notifications WHERE processed = 0')
          .all() as Notification[]
        for (const { payload, id } of notifications) {
          db.prepare('UPDATE _notifications SET processed = 1 WHERE id = ?').run([id])
          this.onNotification.map((callback) => callback(payload))
        }
      }
      this.interval = setInterval(emitNotification, 500)
    }
  }

  disconnect = async (): Promise<void> => {
    if (this.interval) clearInterval(this.interval)
    if (this.client) await this.client.end()
    await this.kysely.destroy()
  }

  exec = async (query: string): Promise<void> => {
    if (this.db instanceof SQLite) this.db.exec(query)
    else if (this.db instanceof pg.Pool) await this.db.query(query)
  }

  query = async <T>(
    text: string,
    values: (string | number)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    if (this.db instanceof SQLite) {
      const stmt = this.db.prepare(text)
      const isSelect = text.trim().toUpperCase().startsWith('SELECT')
      if (isSelect) {
        const rows = stmt.all(values) as T[]
        return { rows, rowCount: rows.length }
      } else {
        const info = stmt.run(values)
        return { rows: [], rowCount: info.changes || 0 }
      }
    } else if (this.db instanceof pg.Pool) {
      const { rows, rowCount } = await this.db.query(text, values)
      return { rows, rowCount: rowCount || 0 }
    } else throw new Error('DatabaseDriver: database not connected')
  }

  table = (name: string) => {
    return new DatabaseTableDriver(name, this.kysely, this.db)
  }

  on = (event: 'notification', callback: (payload: string) => void) => {
    if (this.client) {
      this.client.on(event, (msg) => {
        if (msg.payload) callback(msg.payload)
      })
    } else if (this.db instanceof SQLite) {
      if (event === 'notification') {
        this.onNotification.push(callback)
      }
    }
  }
}
