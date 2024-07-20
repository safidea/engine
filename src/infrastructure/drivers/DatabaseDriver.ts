import type { Driver } from '@adapter/spi/DatabaseSpi'
import SQLite from 'better-sqlite3'
import pg from 'pg'
import { Kysely, PostgresDialect, SqliteDialect } from 'kysely'
import { DatabaseTableDriver, type Schema } from './DatabaseTableDriver'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto, EventNotificationDto } from '@adapter/spi/dtos/EventDto'

interface Notification {
  id: number
  payload: string
  processed: number
}

export class DatabaseDriver implements Driver {
  private kysely: Kysely<Schema>
  private db: SQLite.Database | pg.Pool
  private client?: pg.PoolClient
  private interval?: Timer
  private onNotification: ((event: EventNotificationDto) => void)[] = []

  constructor(config: Config) {
    const { type, url } = config
    if (type === 'sqlite') {
      const db = new SQLite(url)
      db.pragma('journal_mode = WAL')
      const dialect = new SqliteDialect({ database: db })
      this.kysely = new Kysely<Schema>({ dialect })
      this.db = db
    } else if (type === 'postgres') {
      const NUMERIC_OID = 1700
      const pool = new pg.Pool({ connectionString: url })
      pool.on('error', () => {})
      pool.on('connect', (client) => {
        client.on('error', () => {})
        client.setTypeParser(NUMERIC_OID, (value) => parseFloat(value))
      })
      const dialect = new PostgresDialect({ pool })
      this.kysely = new Kysely<Schema>({ dialect })
      this.db = pool
    } else throw new Error(`DatabaseDriver: database "${type}" not supported`)
  }

  connect = async (): Promise<void> => {
    if (this.db instanceof pg.Pool) this.client = await this.db.connect()
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
          this.onNotification.map((callback) => callback({ payload, event: 'notification' }))
        }
      }
      this.interval = setInterval(emitNotification, 500)
    }
  }

  disconnect = async (): Promise<void> => {
    if (this.interval) clearInterval(this.interval)
    if (this.client) this.client.release()
    await this.kysely.destroy()
  }

  exec = async (query: string): Promise<void> => {
    if (this.db instanceof SQLite) this.db.exec(query)
    else if (this.client && query.includes('LISTEN')) await this.client.query(query)
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

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    if (this.client) {
      if (event === 'notification')
        this.client.on('notification', ({ payload }) => {
          callback({ payload, event: 'notification' })
        })
      if (event === 'error')
        this.client.on('error', ({ message }) => {
          callback({ message, event: 'error' })
        })
    }
    if (this.db instanceof pg.Pool) {
      if (event === 'error')
        this.db.on('error', ({ message }) => {
          callback({ message, event: 'error' })
        })
    }
    if (this.db instanceof SQLite) {
      if (event === 'notification') this.onNotification.push(callback)
    }
  }
}
