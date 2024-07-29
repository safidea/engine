import SQLite from 'better-sqlite3'
import type { Driver } from '@adapter/spi/DatabaseSpi'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto, EventNotificationDto } from '@adapter/spi/dtos/EventDto'
import { SqliteTableDriver } from './SqliteTableDriver'

interface Notification {
  id: number
  payload: string
  processed: number
}

export class SqliteDriver implements Driver {
  private _db: SQLite.Database
  private _interval?: Timer
  private _onNotification: ((event: EventNotificationDto) => void)[] = []

  constructor(config: Config) {
    const { url } = config
    const db = new SQLite(url)
    db.pragma('journal_mode = WAL')
    this._db = db
  }

  connect = async (): Promise<void> => {
    this._db.exec(`
      CREATE TABLE IF NOT EXISTS _notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payload TEXT,
        processed INTEGER DEFAULT 0
      );
    `)
    const emitNotification = () => {
      const notifications = this._db
        .prepare('SELECT * FROM _notifications WHERE processed = 0')
        .all() as Notification[]
      for (const { payload, id } of notifications) {
        this._db.prepare('UPDATE _notifications SET processed = 1 WHERE id = ?').run([id])
        this._onNotification.map((callback) => callback({ payload, event: 'notification' }))
      }
    }
    this._interval = setInterval(emitNotification, 500)
  }

  disconnect = async (): Promise<void> => {
    if (this._interval) clearInterval(this._interval)
    this._db.close()
  }

  exec = async (query: string): Promise<void> => {
    this._db.exec(query)
  }

  query = async <T>(
    text: string,
    values: (string | number)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    const stmt = this._db.prepare(text)
    const isSelect = text.trim().toUpperCase().startsWith('SELECT')
    if (isSelect) {
      const rows = stmt.all(values) as T[]
      return { rows, rowCount: rows.length }
    } else {
      const info = stmt.run(values)
      return { rows: [], rowCount: info.changes || 0 }
    }
  }

  table = (name: string) => {
    return new SqliteTableDriver(name, this._db)
  }

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    if (event === 'notification') this._onNotification.push(callback)
  }
}
