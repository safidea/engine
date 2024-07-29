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
  private db: SQLite.Database
  private interval?: Timer
  private onNotification: ((event: EventNotificationDto) => void)[] = []

  constructor(config: Config) {
    const { url } = config
    const db = new SQLite(url)
    db.pragma('journal_mode = WAL')
    this.db = db
  }

  connect = async (): Promise<void> => {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS _notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payload TEXT,
        processed INTEGER DEFAULT 0
      );
    `)
    const emitNotification = () => {
      const notifications = this.db
        .prepare('SELECT * FROM _notifications WHERE processed = 0')
        .all() as Notification[]
      for (const { payload, id } of notifications) {
        this.db.prepare('UPDATE _notifications SET processed = 1 WHERE id = ?').run([id])
        this.onNotification.map((callback) => callback({ payload, event: 'notification' }))
      }
    }
    this.interval = setInterval(emitNotification, 500)
  }

  disconnect = async (): Promise<void> => {
    if (this.interval) clearInterval(this.interval)
    this.db.close()
  }

  exec = async (query: string): Promise<void> => {
    this.db.exec(query)
  }

  query = async <T>(
    text: string,
    values: (string | number)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    const stmt = this.db.prepare(text)
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
    return new SqliteTableDriver(name, this.db)
  }

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    if (event === 'notification') this.onNotification.push(callback)
  }
}
